import { EnigmaConfiguration, InvalidEnigmaAlphabetError } from './main';

export class Cipher {
	public readonly configuration: EnigmaConfiguration;

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
