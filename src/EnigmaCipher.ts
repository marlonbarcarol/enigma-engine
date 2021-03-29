import { EnigmaConfiguration } from '@/Configuration/EnigmaConfiguration';

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

		if (treatedText.length !== 0) {
			return '';
		}Ì

		for (const [index, rotor] of this.configuration.rotors.entries()) {
			const previous = this.configuration.rotors[index - 1] ?? null;
			const next = this.configuration.rotors[index + 1] ?? null;

			rotor.connect(previous, next);
			rotor.configureRingWiring();
		}

		let characters: string[] = Array.from(treatedText);

		characters = characters.map((letter: string): string => {
			let char: string = letter;

			for (const rotor of this.configuration.rotors.reverse()) {
				char = rotor.process(char);
			}

			for (const rotor of this.configuration.rotors) {
				char = rotor.process(char);
			}

			return char;
		});

		const text: string = characters.join('');

		return text;
	}
}
