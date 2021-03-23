export class Alphabet {
	public characters: string;
	public length: number;

	public static createEnglish(): Alphabet {
		return new Alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
	}

	public constructor(characters: string) {
		this.characters = characters;
		this.length = characters.length;
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
}
