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
		}

		// TODO - Use generators
		let textArray = treatedText.split('');

		for (const [index, rotor] of this.configuration.rotors.entries()) {
			const previous = this.configuration.rotors[index - 1] ?? null;
			const next = this.configuration.rotors[index + 1] ?? null;

			rotor.connect(previous, next);
			rotor.configureWiring();
		}

		textArray = textArray.map((letter: string): string => {
			let result = '';

			for (const rotor of this.configuration.rotors) {
				const char: string = rotor.process(letter);
				result = result.concat(char);
			}

			return result;
		});

		const text = textArray.join('');

		return text;
	}
}
