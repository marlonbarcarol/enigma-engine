import { Alphabet } from '@/Configuration/Alphabet/Alphabet';

export class InvalidWiringLengthError extends Error {
	public static create(input: Alphabet, output: Alphabet): InvalidWiringLengthError {
		return new InvalidWiringLengthError(input.characters, output.characters);
	}

	public constructor(public input: string, public output: string) {
		super(
			`Invalid alphabet provided. Please make sure that the input (${input}) and output (${output}) alphabets have the same length.`,
		);
	}
}
