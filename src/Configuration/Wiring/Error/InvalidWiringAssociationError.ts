import { Alphabet } from '../../Alphabet/Alphabet';

export class InvalidWiringAssociationError extends Error {
	public static create(input: Alphabet, output: Alphabet): InvalidWiringAssociationError {
		return new InvalidWiringAssociationError(input.order(), output.order());
	}

	public constructor(public input: string, public output: string) {
		super(
			`Invalid wiring provided. Please make sure that all caracteres from input (${input}) are present on the output (${output}) mapping.`,
		);
	}
}
