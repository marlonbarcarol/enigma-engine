export class UniqueAlphabetCharacterError extends Error {
	public static create(characters: string): UniqueAlphabetCharacterError {
		return new UniqueAlphabetCharacterError(characters);
	}

	public constructor(public characters: string) {
		super(`Invalid alphabet provided "${characters}". Please make sure that all caracteres are unique.`);
	}
}
