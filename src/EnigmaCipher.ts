import { EnigmaConfiguration } from '@/Configuration/EnigmaConfiguration';

export class EnigmaCharProcessor {
	public readonly configuration: EnigmaConfiguration;

	public constructor(configuration: EnigmaConfiguration) {
		this.configuration = configuration;
	}
}

export class EnigmaCipher {
	public readonly configuration: EnigmaConfiguration;

	public constructor(configuration: EnigmaConfiguration) {
		this.configuration = configuration;
	}

	/**
	 * Enigma machine is actually a symmetrical cipher,
	 * meaning the decryption method is the same as the encryption.
	 */
	public encrypt(plaintext: string): string {
		let treatedText = plaintext.toUpperCase();

		const regex = new RegExp(`[^${this.configuration.alphabet.characters}]+`, 'gm');
		treatedText = treatedText.replace(regex, '');

		if (treatedText.length === 0) {
			return '';
		}

		for (const [index, rotor] of this.configuration.rotors.entries()) {
			const previous = this.configuration.rotors[index - 1] ?? null;
			const next = this.configuration.rotors[index + 1] ?? null;

			rotor.connect(previous, next);
			rotor.configureRingWiring();
		}

		let characters: string[] = Array.from(treatedText);

		characters = characters.map((letter: string): string => {
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

			return char;
		});

		const text: string = characters.join('');

		return text;
	}
}
