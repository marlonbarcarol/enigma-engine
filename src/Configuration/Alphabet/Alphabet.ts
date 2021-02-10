class Alphabet {
	public letters: string;
	public length: number;

	public static createEnglish(): Alphabet {
		return new Alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
	}

	public constructor(letters: string) {
		this.letters = letters;
		this.length = letters.length;
	}

	public getLetterPosition(letter: string): number {
		return this.letters.indexOf(letter);
	}

	public getLetterFromPosition(position: number): string {
		if (position > this.length) {
			throw new Error(
				`Invalid position provided. Please make sure to provide letters from the alphabet "${this.letters}".`,
			);
		}

		return this.letters[position];
	}
}

export { Alphabet };
