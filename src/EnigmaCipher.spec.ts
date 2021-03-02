import { Alphabet } from '@/Configuration/Alphabet/Alphabet';
import { EnigmaConfiguration } from '@/Configuration/EnigmaConfiguration';
import { Rotor } from '@/Configuration/Rotor/Rotor';
import { RotorRing } from '@/Configuration/Rotor/RotorRing';
import { RotorWiring } from '@/Configuration/Rotor/RotorWiring';
import { EnigmaCipher } from '@/EnigmaCipher';

describe('EnigmaCipher.ts', () => {
	test('Can instantiate', () => {
		const ring = new RotorRing(Alphabet.createEnglish().positionOf('A'));
		const wiring = RotorWiring.withEnglish(new Alphabet('MOQFBCJSKVXLREYTGUDNIWHAPZ'));
		const configuration = EnigmaConfiguration.withEnglish([
			new Rotor(ring, wiring, wiring.input.positionOf(wiring.input.at(0))),
		]);

		const cipher = new EnigmaCipher(configuration);

		expect(cipher).toBeInstanceOf(EnigmaCipher);
	});
});
