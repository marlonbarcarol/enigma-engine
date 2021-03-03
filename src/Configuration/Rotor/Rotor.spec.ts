import { Alphabet } from '@/Configuration/Alphabet/Alphabet';
import { Rotor } from '@/Configuration/Rotor/Rotor';
import { RotorRing } from '@/Configuration/Rotor/RotorRing';
import { RotorWiring } from '@/Configuration/Rotor/RotorWiring';

describe('Rotor.ts', () => {
	test('Can configure wiring', () => {
		const ring = new RotorRing(Alphabet.createEnglish().positionOf('A'));
		let wiring = RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ'));
		const rotor = new Rotor(ring, wiring, wiring.input.positionOf(wiring.input.at(0)));

		rotor.configureWiring();

		wiring = rotor.wiring;

		expect(wiring.input.characters).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		expect(wiring.output.characters).toEqual('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
	});

	test('Can turnover', () => {
		const ring = new RotorRing(Alphabet.createEnglish().positionOf('A'));
		const wiring = RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ'));
		const rotor = new Rotor(ring, wiring, wiring.input.positionOf(wiring.input.at(0)));

		rotor.configureWiring();

		expect(rotor.pointer).toStrictEqual(0);

		for (let i = 0; i < 100; i++) {
			expect(rotor.pointer).toStrictEqual(i);
			rotor.turnover();
		}

		expect(rotor.pointer).toStrictEqual(100);
	});

	test('Can process', () => {
		const ring = new RotorRing(Alphabet.createEnglish().positionOf('A'));
		const wiring = RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ'));
		const rotor = new Rotor(ring, wiring, wiring.input.positionOf(wiring.input.at(0)));

		rotor.configureWiring();

		const char = rotor.process('A');

		expect(char).toEqual('J');
	});
});
