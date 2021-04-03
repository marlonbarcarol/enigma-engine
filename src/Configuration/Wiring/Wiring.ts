import { Alphabet } from '@/Configuration/Alphabet/Alphabet';

export class Wiring {
	// The input associated with the output.
	public readonly input: Alphabet;
	// The output associated with the input.
	public readonly output: Alphabet;

	public readonly quantity: number;

	public constructor(input: Alphabet, output: Alphabet) {
		if (input.length !== output.length) {
			throw new Error(
				`Invalid alphabet provided. Please make sure that the input (${input.characters}) and output (${output.characters}) alphabets have the same length.`,
			);
		}

		this.input = input;
		this.output = output;
		this.quantity = output.length;
	}

	public static withEnglish(output: Alphabet): Wiring {
		return new this(Alphabet.createEnglish(), output);
	}

	/**
	 * Creates a new wiring keeping current input.
	 */
	public withInput(input: Alphabet): Wiring {
		return new Wiring(input, this.output);
	}

	/**
	 * Creates a new wiring keeping current output.
	 */
	public withOutput(output: Alphabet): Wiring {
		return new Wiring(this.input, output);
	}

	/**
	 * Return the output letter mapped by the input wiring.
	 */
	public getInputMappedCharAt(position: number): string {
		const pointer = this.input.positionOf(this.input.at(position));
		const char = this.output.at(pointer);

		return char;
	}

	/**
	 * Return the input letter mapped by the output wiring.
	 */
	public getOutputMappedCharAt(position: number): string {
		const pointer = this.output.positionOf(this.input.at(position));
		const char = this.input.at(pointer);

		return char;
	}

	public toString(): string {
		return `
		${this.input.characters}
		${this.output.characters}
		`;
	}
}
