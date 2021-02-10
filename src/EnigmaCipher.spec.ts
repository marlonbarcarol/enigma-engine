import { Alphabet } from "@/Configuration/Alphabet/Alphabet";
import { EnigmaConfiguration } from "@/Configuration/EnigmaConfiguration";
import { Rotor } from "@/Configuration/Rotor/Rotor";
import { RotorAlphabetWiring } from "@/Configuration/Rotor/RotorAlphabetWiring";
import { EnigmaCipher } from "@/EnigmaCipher";

describe('EnigmaCipher.ts', () => {
	test('Can instantiate', () => {
		const wiring = RotorAlphabetWiring.withEnglish(new Alphabet('MOQFBCJSKVXLREYTGUDNIWHAPZ'));
		const configuration = EnigmaConfiguration.withEnglish([
			new Rotor(wiring, wiring.getWiringLetter(0)),
		]);

		const cipher = new EnigmaCipher(configuration);

		expect(cipher).toBeInstanceOf(EnigmaCipher);
	});
});
