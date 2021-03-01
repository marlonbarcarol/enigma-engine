import { Alphabet } from '@/Configuration/Alphabet/Alphabet';
import { Rotor } from '@/Configuration/Rotor/Rotor';

export class EnigmaConfiguration {
	public readonly alphabet: Alphabet;
	public readonly rotors: Rotor[];

	public static withEnglish(rotors: Rotor[]): EnigmaConfiguration {
		return new EnigmaConfiguration(Alphabet.createEnglish(), rotors);
	}

	public constructor(alphabet: Alphabet, rotors: Rotor[]) {
		this.alphabet = alphabet;
		this.rotors = rotors;
	}
}
