import { Rotor } from './Configuration/Rotor/Rotor';
import {
	Alphabet,
	EnigmaConfiguration,
	InvalidEnigmaAlphabetError,
	Plugboard,
	Reflector,
	RotorWiring,
	Wheel,
	Wiring,
} from './main';
import { Nullable } from './types/type';

export interface CipherJSON {
	alphabet: string;
	plugboard?: { wiring: string };
	entry?: { wiring: string };
	rotors: Array<{
		wiring: string;
		position?: string;
		notches?: string[];
		lock?: boolean;
	}>;
	reflector?: { wiring: string };
	chargroup?: Nullable<number>;
}

export class Cipher {
	public readonly configuration: EnigmaConfiguration;

	public static fromJSON(json: CipherJSON): Cipher {
		const alphabet = new Alphabet(json.alphabet);
		const plugboard = json.plugboard
			? new Plugboard(new Wiring(alphabet, Alphabet.create(json.plugboard.wiring)))
			: null;

		const entry = json.entry
			? new Wheel(new Wiring(alphabet, Alphabet.create(json.entry.wiring)))
			: null;

		const rotors = json.rotors.map((configuration) => {
			return new Rotor({
				wiring: new RotorWiring(alphabet, Alphabet.create(configuration.wiring)),
				notches: configuration.notches,
				position: configuration.position,
				lock: configuration.lock,
			});
		});

		const reflector = json.reflector
			? new Reflector(new Wiring(alphabet, Alphabet.create(json.reflector.wiring)))
			: null;

		const chargroup = json.chargroup;

		return new Cipher({
			alphabet,
			plugboard,
			entry,
			rotors,
			reflector,
			chargroup,
		});
	}

	public constructor(configuration: EnigmaConfiguration) {
		const characters = configuration.alphabet.order();

		if (
			configuration.plugboard &&
			characters.includes(configuration.plugboard.wiring.input.order()) === false
		) {
			throw InvalidEnigmaAlphabetError.createForPlugboard(characters, configuration.plugboard);
		}

		if (
			configuration.entry &&
			characters.includes(configuration.entry.wiring.input.order()) === false
		) {
			throw InvalidEnigmaAlphabetError.createForEntry(characters, configuration.entry);
		}

		if (
			configuration.reflector &&
			characters.includes(configuration.reflector.wiring.input.order()) === false
		) {
			throw InvalidEnigmaAlphabetError.createForReflector(characters, configuration.reflector);
		}

		for (const [index, rotor] of configuration.rotors.entries()) {
			if (characters.includes(rotor.wiring.input.order()) === false) {
				throw InvalidEnigmaAlphabetError.createForRotor(index, characters, rotor);
			}
		}

		this.configuration = configuration;
	}

	/**
	 * Enigma machine is actually a symmetrical cipher,
	 * meaning the decryption method is the same as the encryption.
	 */
	public encrypt(plaintext: string): string {
		let text: string = plaintext.toUpperCase();

		const regex = new RegExp(`[^${this.configuration.alphabet.characters}]+`, 'gm');
		text = text.replace(regex, '');

		if (text.length === 0) {
			return '';
		}

		for (const [index, rotor] of this.configuration.rotors.entries()) {
			const previous = this.configuration.rotors[index - 1] ?? null;
			const next = this.configuration.rotors[index + 1] ?? null;

			rotor.connect(previous, next);
			rotor.configureRingWiring();
		}

		let characters: string[] = Array.from(text);

		characters = characters.map((letter: string, index: number): string => {
			let char: string = letter;

			if (this.configuration.plugboard) {
				char = this.configuration.plugboard.process(char);
				this.configuration.plugboard.flipOrder();
			}

			if (this.configuration.entry) {
				char = this.configuration.entry.process(char);
				this.configuration.entry.flipOrder();
			}

			// Rotors are processed from reverse order
			if (this.configuration.rotors.length > 0) {
				char = this.configuration.rotors[this.configuration.rotors.length - 1].process(char);
			}

			this.configuration.rotors.forEach((rotor) => rotor.flipOrder());

			if (this.configuration.reflector) {
				char = this.configuration.reflector.process(char);
			}

			if (this.configuration.rotors.length > 0) {
				char = this.configuration.rotors[0].process(char);
			}

			if (this.configuration.entry) {
				char = this.configuration.entry.process(char);
				this.configuration.entry.flipOrder();
			}

			if (this.configuration.plugboard) {
				char = this.configuration.plugboard.process(char);
				this.configuration.plugboard.flipOrder();
			}

			this.configuration.rotors.forEach((rotor) => rotor.flipOrder());

			if (this.configuration.chargroup === undefined || this.configuration.chargroup === null) {
				return char;
			}

			if (this.configuration.chargroup === 0) {
				return char;
			}

			if ((index + 1) % this.configuration.chargroup === 0) {
				return char.concat(' ');
			}

			return char;
		});

		text = characters.join('');
		text = text.trim();

		return text;
	}
}
