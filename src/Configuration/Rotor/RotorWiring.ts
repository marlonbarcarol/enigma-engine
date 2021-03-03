import { Alphabet } from '@/Configuration/Alphabet/Alphabet';

// A rotor contains an alphabet (input) wired to a shuffled alphabet (output).
export class RotorWiring {
	// The input associated with the output.
	public readonly input: Alphabet;
	// The output associated with the input.
	public readonly output: Alphabet;

	private readonly capacity: number;

	public static withEnglish(alphabet: Alphabet): RotorWiring {
		return new RotorWiring(Alphabet.createEnglish(), alphabet);
	}

	public constructor(input: Alphabet, output: Alphabet) {
		if (input.length !== output.length) {
			throw new Error(
				`Invalid alphabet provided. Please make sure that the input (${input.characters}) and output (${output.characters}) alphabets have the same length.`,
			);
		}

		this.input = input;
		this.output = output;
		this.capacity = output.length;
	}

	/**
	 * Creates a new rotor wiring keeping the current input.
	 */
	public withOutput(alphabet: Alphabet): RotorWiring {
		return new RotorWiring(this.input, alphabet);
	}

	/**
	 * Moves the wiring output letters up.
	 */
	public shiftUp(): RotorWiring {
		let output = '';

		for (const letter of this.output.characters) {
			let position: number = this.input.positionOf(letter);
			position = (position + 1) % this.size();

			const newLetter: string = this.input.at(position);

			output = output.concat(newLetter);
		}

		const alphabet = new Alphabet(output);
		const rotorWiring = this.withOutput(alphabet);

		return rotorWiring;
	}

	/**
	 * Moves the wiring letters as a looping queue: last to first, first to second, and so on.
	 */
	public rotate(): RotorWiring {
		let newWiring = '';

		newWiring = newWiring.concat(this.output.characters.slice(-1));
		newWiring = newWiring.concat(this.output.characters.slice(0, -1));

		const alphabet = new Alphabet(newWiring);
		const rotorWiring = this.withOutput(alphabet);

		return rotorWiring;
	}

	/**
	 * Return the output letter mapped by the input wiring.
	 */
	public getMappedCharAt(position: number): string {
		const pointer = this.input.positionOf(this.input.at(position));

		return this.output.at(pointer);
	}

	/**
	 * Return the input letter mapped by the output wiring.
	 */
	public getReverseMappedCharAt(position: number): string {
		const pointer = this.output.positionOf(this.output.at(position));

		return this.input.at(pointer);
	}

	public size(): number {
		return this.capacity;
	}

	public toString(): string {
		return `
		${this.input.characters}
		${this.output.characters}
		`;
	}
}
