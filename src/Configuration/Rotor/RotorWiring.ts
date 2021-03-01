import { Alphabet } from '@/Configuration/Alphabet/Alphabet';

// A rotor contains a ring alphabet wired to a shuffled alphabet.
export class RotorWiring {
	// The ring alphabet.
	public readonly input: Alphabet;

	// The alphabet sequence that the ring alphabet is wired to.
	public readonly output: Alphabet;

	private readonly capacity: number;

	public static withEnglish(alphabet: Alphabet): RotorWiring {
		return new RotorWiring(Alphabet.createEnglish(), alphabet);
	}

	public constructor(input: Alphabet, output: Alphabet) {
		if (input.length !== output.length) {
			throw new Error(
				`Invalid alphabet provided. Please make sure that the input (${input.letters}) and output (${output.letters}) alphabets have the same length.`,
			);
		}

		this.input = input;
		this.output = output;
		this.capacity = output.length;
	}

	public withOutput(alphabet: Alphabet): RotorWiring {
		return new RotorWiring(this.input, alphabet);
	}

	public shift(): RotorWiring {
		let output: string = '';

		for(let letter of this.output.letters) {
			let position: number = this.input.getLetterPosition(letter);
			position = (position + 1) % this.size();

			const newLetter: string = this.input.getLetterFromPosition(position);

			output = output.concat(newLetter);
		}

		const alphabet = new Alphabet(output);
		const rotorWiring = this.withOutput(alphabet);

		return rotorWiring;
	}


	public rotate(): RotorWiring {
		let newWiring: string = '';

		newWiring = newWiring.concat(this.output.letters.slice(-1));
		newWiring = newWiring.concat(this.output.letters.slice(0, -1));

		const alphabet = new Alphabet(newWiring);
		const rotorWiring = this.withOutput(alphabet);

		return rotorWiring;
	}

	public toString(): string {
		return `
		${this.input.letters}
		${this.output.letters}
		`;
	}

	/**
	 * Return the position of the marked letter, usually A, in the wiring.
	 */
	public getStartMarkingLetter(): string {
		return this.input.getLetterFromPosition(0);
	}

	public getOutputPosition(letter: string): number {
		const index = this.input.letters.indexOf(letter);

		if (index <= -1) {
			throw new Error(`Could not find letter "${letter}" in the alphabet ${this.input.letters}`);
		}

		return index;
	}

	public getOutputLetter(position: number): string {
		const letter = this.output.letters[position];

		if (position > this.size() || position < 0) {
			throw new Error(`Cannot get output letter for an out of boundary (0-${this.size()}) position "${position}".`);
		}

		return letter;
	}

	/**
	 * Return the ring position of a given letter.
	 */
	public getInputPosition(letter: string): number {
		const index = this.input.letters.indexOf(letter);

		if (index <= -1) {
			throw new Error(`Could not find letter "${letter}" in the alphabet ${this.input.letters}`);
		}

		return index;
	}

	/**
	 * Return the letter for the ring alphabet of a given position.
	 */
	public getInputLetter(position: number): string {
		const letter = this.input.letters[position];

		if (position > this.size() || position < 0) {
			throw new Error(`Cannot get input letter for an out of boundary (0-${this.size()}) position "${position}".`);
		}

		return letter;
	}

	public size(): number {
		return this.capacity;
	}
}
