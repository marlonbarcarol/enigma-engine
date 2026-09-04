export class InvalidTraceLetterError extends Error {
	public static create(letter: string, alphabetCharacters: string): InvalidTraceLetterError {
		return new InvalidTraceLetterError(
			`encryptWithTrace() requires exactly one character from the alphabet "${alphabetCharacters}", received "${letter}".`,
		);
	}
}
