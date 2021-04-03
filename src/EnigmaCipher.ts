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

			// this.configuration.rotors.forEach((rotor) => rotor.rotate());
			// this.configuration.reflector.rotate();
			this.configuration.rotors[2].rotate();

			char = this.configuration.plugboard.process(char);
			char = this.configuration.entry.process(char);
			char = this.configuration.rotors[2].process(char);
			char = this.configuration.rotors[1].process(char);
			char = this.configuration.rotors[0].process(char);

			this.configuration.plugboard.flipOrder();
			this.configuration.entry.flipOrder();
			this.configuration.rotors.forEach((rotor) => rotor.flipOrder());

			// char = this.configuration.rotors.reduce((result, rotor) => rotor.process(result), char);
			char = this.configuration.reflector.process(char);

			// char = this.configuration.rotors.reverse().reduce((result, rotor) => rotor.process(result), char);
			char = this.configuration.rotors[0].process(char);
			char = this.configuration.rotors[1].process(char);
			char = this.configuration.rotors[2].process(char);
			char = this.configuration.entry.process(char);
			char = this.configuration.plugboard.process(char);

			this.configuration.plugboard.flipOrder();
			this.configuration.entry.flipOrder();
			this.configuration.rotors.forEach((rotor) => rotor.flipOrder());

			return char;
		});

		const text: string = characters.join('');

		return text;
	}
}
