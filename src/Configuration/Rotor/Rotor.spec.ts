import { Alphabet } from '@/Configuration/Alphabet/Alphabet';
import { Rotor } from '@/Configuration/Rotor/Rotor';
import { RotorRing } from '@/Configuration/Rotor/RotorRing';
import { RotorWiring } from '@/Configuration/Rotor/RotorWiring';

describe('Rotor.ts', () => {
	test('Can configure wiring', () => {
		const ring = new RotorRing(Alphabet.createEnglish().positionOf('A'));
		let wiring = RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ'));
		const rotor = new Rotor(ring, wiring, wiring.input.positionOf('A'));

		rotor.configureRingWiring();

		wiring = rotor.wiring;

		expect(wiring.input.characters).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		expect(wiring.output.characters).toEqual('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
	});

	describe('Can turnover', () => {
		const ring = new RotorRing(Alphabet.createEnglish().positionOf('A'));
		const wiring = RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ'));
		const rotor = new Rotor(ring, wiring, wiring.input.positionOf('A'));

		rotor.configureRingWiring();

		for (let i = 0; i < 100; i++) {
			test(`Turning over #${i}`, () => {
				expect(rotor.pointer).toStrictEqual(i);
				rotor.turnover();
				expect(rotor.pointer).toStrictEqual(i + 1);
			});
		}
	});

	test('Can process', () => {
		const ring = new RotorRing(Alphabet.createEnglish().positionOf('A'));
		const wiring = RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO'));
		const rotor = new Rotor(ring, wiring, wiring.input.positionOf('A'));

		rotor.configureRingWiring();

		let char: string;

		rotor.turnover();
		char = rotor.process('A');
		expect(char).toEqual('C');

		rotor.turnover();
		char = rotor.process('A');
		expect(char).toEqual('D');

		rotor.turnover();
		char = rotor.process('A');
		expect(char).toEqual('E');

		rotor.turnover();
		char = rotor.process('A');
		expect(char).toEqual('F');

		rotor.turnover();
		char = rotor.process('A');
		expect(char).toEqual('G');

		rotor.turnover();
		char = rotor.process('A');
		expect(char).toEqual('W');
	});
});
