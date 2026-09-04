import { Rotor, RotorTraceHit } from './Configuration/Rotor/Rotor';
import {
	Alphabet,
	EnigmaConfiguration,
	InvalidEnigmaAlphabetError,
	InvalidTraceLetterError,
	Plugboard,
	Reflector,
	RotorRing,
	RotorWiring,
	Wheel,
	Wiring,
} from './main';
import { Nullable } from './types/type';

export interface CipherOptions {
	alphabet: string;
	plugboard?: { wiring: string };
	entry?: { wiring: string };
	rotors: Array<{
		wiring: string;
		position?: string;
		notches?: string[];
		lock?: boolean;
		ring?: string; // Ring setting (Ringstellung), as a letter. Defaults to the first character of the alphabet.
	}>;
	reflector?: { wiring: string; position?: string }; // `position` defaults to the first character of the alphabet.
	chargroup?: Nullable<number>;
}

export interface CipherTraceStep {
	component: 'plugboard' | 'entry' | 'rotor' | 'reflector';
	index?: number; // rotor index, only present when component === 'rotor'
	direction?: 'in' | 'out' | 'reverse' | 'forward';
	input: string;
	output: string;
	rotorPosition?: string; // the rotor's current-position letter, only for component === 'rotor'
}

export interface CipherTraceResult {
	output: string;
	trace: CipherTraceStep[];
}

export class Cipher {
	public readonly configuration: EnigmaConfiguration;

	public static create(options: CipherOptions): Cipher {
		const alphabet = new Alphabet(options.alphabet);
		const plugboard = options.plugboard
			? new Plugboard(new Wiring(alphabet, Alphabet.create(options.plugboard.wiring)))
			: null;

		const entry = options.entry
			? new Wheel(new Wiring(alphabet, Alphabet.create(options.entry.wiring)))
			: null;

		const rotors = options.rotors.map((configuration) => {
			return new Rotor({
				wiring: new RotorWiring(alphabet, Alphabet.create(configuration.wiring)),
				notches: configuration.notches,
				position: configuration.position,
				lock: configuration.lock,
				ring: configuration.ring
					? new RotorRing(alphabet.positionOf(configuration.ring))
					: undefined,
			});
		});

		const reflector = options.reflector
			? new Reflector(
					new Wiring(alphabet, Alphabet.create(options.reflector.wiring)),
					options.reflector.position ? alphabet.positionOf(options.reflector.position) : undefined,
				)
			: null;

		const chargroup = options.chargroup;

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

		for (const [index, rotor] of configuration.rotors.entries()) {
			const previous = configuration.rotors[index - 1] ?? null;
			const next = configuration.rotors[index + 1] ?? null;

			rotor.connect(previous, next);
			rotor.configureRingWiring();
		}
	}

	/**
	 * Enigma machine is actually a symmetrical cipher,
	 * meaning the decryption method is the same as the encryption.
	 */
	public encrypt(plaintext: string): string {
		let text: string = plaintext.toUpperCase();

		// Escape characters that carry special meaning inside a regex character class,
		// since the alphabet may contain any user-chosen characters.
		const escapedAlphabet = this.configuration.alphabet.characters.replace(/[-\\^\]]/g, '\\$&');
		const regex = new RegExp(`[^${escapedAlphabet}]+`, 'gm');
		text = text.replace(regex, '');

		if (text.length === 0) {
			return '';
		}

		let characters: string[] = Array.from(text);

		characters = characters.map((letter: string, index: number): string => {
			const { output } = this.processCharacterWithTrace(letter, false);

			if (this.configuration.chargroup === undefined || this.configuration.chargroup === null) {
				return output;
			}

			if (this.configuration.chargroup === 0) {
				return output;
			}

			if ((index + 1) % this.configuration.chargroup === 0) {
				return output.concat(' ');
			}

			return output;
		});

		text = characters.join('');
		text = text.trim();

		return text;
	}

	/**
	 * Like `encrypt()`, but for exactly one character, returning the full
	 * stage-by-stage trace of how that letter travelled through the machine:
	 * plugboard -> entry -> rotors (reverse) -> reflector -> rotors (forward)
	 * -> entry -> plugboard.
	 */
	public encryptWithTrace(letter: string): CipherTraceResult {
		let text: string = letter.toUpperCase();

		const escapedAlphabet = this.configuration.alphabet.characters.replace(/[-\\^\]]/g, '\\$&');
		const regex = new RegExp(`[^${escapedAlphabet}]+`, 'gm');
		text = text.replace(regex, '');

		if (text.length !== 1) {
			throw InvalidTraceLetterError.create(letter, this.configuration.alphabet.characters);
		}

		const { output, trace } = this.processCharacterWithTrace(text, true);

		return { output, trace: trace as CipherTraceStep[] };
	}

	/**
	 * Runs a single letter through the full signal path, optionally collecting
	 * a step-by-step trace. Shared by `encrypt()` (bulk, trace discarded) and
	 * `encryptWithTrace()` (single character, trace returned), so the
	 * plugboard/entry/rotor/reflector traversal logic lives in exactly one
	 * place.
	 */
	private processCharacterWithTrace(
		letter: string,
		collectTrace: boolean,
	): { output: string; trace: CipherTraceStep[] | null } {
		const trace: CipherTraceStep[] | null = collectTrace ? [] : null;

		let char: string = letter;

		if (this.configuration.plugboard) {
			const input = char;
			char = this.configuration.plugboard.process(char);
			this.configuration.plugboard.flipOrder();
			trace?.push({ component: 'plugboard', direction: 'in', input, output: char });
		}

		if (this.configuration.entry) {
			const input = char;
			char = this.configuration.entry.process(char);
			this.configuration.entry.flipOrder();
			trace?.push({ component: 'entry', direction: 'in', input, output: char });
		}

		// Rotors are processed from reverse order
		if (this.configuration.rotors.length > 0) {
			const hits: RotorTraceHit[] = [];
			char = this.configuration.rotors[this.configuration.rotors.length - 1].processWithTrace(
				char,
				collectTrace ? hits : undefined,
			);

			for (const hit of hits) {
				trace?.push({
					component: 'rotor',
					index: this.configuration.rotors.indexOf(hit.rotor),
					direction: 'reverse',
					input: hit.input,
					output: hit.output,
					rotorPosition: hit.rotor.wiring.input.at(hit.rotor.cap()),
				});
			}
		}

		this.configuration.rotors.forEach((rotor) => rotor.flipOrder());

		if (this.configuration.reflector) {
			const input = char;
			char = this.configuration.reflector.process(char);
			trace?.push({ component: 'reflector', input, output: char });
		}

		if (this.configuration.rotors.length > 0) {
			const hits: RotorTraceHit[] = [];
			char = this.configuration.rotors[0].processWithTrace(char, collectTrace ? hits : undefined);

			for (const hit of hits) {
				trace?.push({
					component: 'rotor',
					index: this.configuration.rotors.indexOf(hit.rotor),
					direction: 'forward',
					input: hit.input,
					output: hit.output,
					rotorPosition: hit.rotor.wiring.input.at(hit.rotor.cap()),
				});
			}
		}

		if (this.configuration.entry) {
			const input = char;
			char = this.configuration.entry.process(char);
			this.configuration.entry.flipOrder();
			trace?.push({ component: 'entry', direction: 'out', input, output: char });
		}

		if (this.configuration.plugboard) {
			const input = char;
			char = this.configuration.plugboard.process(char);
			this.configuration.plugboard.flipOrder();
			trace?.push({ component: 'plugboard', direction: 'out', input, output: char });
		}

		this.configuration.rotors.forEach((rotor) => rotor.flipOrder());

		return { output: char, trace };
	}
}
