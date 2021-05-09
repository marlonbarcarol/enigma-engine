import { Plugboard, Reflector, Rotor, Wheel } from '../main';

export class InvalidEnigmaAlphabetError extends Error {
	public static createForPlugboard(characters: string, plugboard: Plugboard): InvalidEnigmaAlphabetError {
		return new InvalidEnigmaAlphabetError(
			`Invalid enigma plugboard configuration alphabet. The alphabet ${characters} is not contained by ${plugboard.wiring.input.order()}.`,
		);
	}

	public static createForEntry(characters: string, entry: Wheel): InvalidEnigmaAlphabetError {
		return new InvalidEnigmaAlphabetError(
			`Invalid enigma entry configuration alphabet. The alphabet ${characters} is not contained by ${entry.wiring.input.order()}.`,
		);
	}

	public static createForReflector(characters: string, reflector: Reflector): InvalidEnigmaAlphabetError {
		return new InvalidEnigmaAlphabetError(
			`Invalid enigma reflector configuration alphabet. The alphabet ${characters} is not contained by ${reflector.wiring.input.order()}.`,
		);
	}

	public static createForRotor(number: number, characters: string, rotor: Rotor): InvalidEnigmaAlphabetError {
		return new InvalidEnigmaAlphabetError(
			`Invalid enigma #${number} rotor configuration alphabet. The alphabet ${characters} is not contained by ${rotor.wiring.input.order()}.`,
		);
	}
}
