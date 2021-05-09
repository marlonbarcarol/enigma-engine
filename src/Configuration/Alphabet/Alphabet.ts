import { UniqueAlphabetCharacterError } from './Error/UniqueAlphabetCharacterError';

export class Alphabet {
	public characters: string;
	public length: number;

	public static createEnglish(): Alphabet {
		return new Alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
	}

	public constructor(characters: string) {
		const charSet = new Set(characters.toUpperCase());

		if (charSet.size !== characters.length) {
			throw UniqueAlphabetCharacterError.create(characters);
		}

		this.characters = characters.toUpperCase();
		this.length = characters.length;
	}

	public static create(characters: string): Alphabet {
		return new Alphabet(characters);
	}

	public positionOf(char: string): number {
		const position = this.characters.indexOf(char);

		if (position === -1) {
			throw new Error(
				`Invalid letter provided "${char}". Please make sure to provide characters from the alphabet "${this.characters}".`,
			);
		}

		return this.characters.indexOf(char);
	}

	public at(position: number): string {
		const char = this.characters[position];

		if (char === undefined) {
			throw new Error(
				`Invalid position provided "${position}". Please make sure to provide characters from the alphabet "${this.characters}".`,
			);
		}

		return char;
	}

	public order(): string {
		return this.characters
			.split('')
			.sort((a, b) => a.localeCompare(b))
			.join('');
	}
}
