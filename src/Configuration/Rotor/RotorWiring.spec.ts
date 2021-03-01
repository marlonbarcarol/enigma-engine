import { Alphabet } from '@/Configuration/Alphabet/Alphabet';
import { RotorWiring } from '@/Configuration/Rotor/RotorWiring';

describe('RotorWiring.ts', () => {
	test('Can shift wiring', () => {
		const wiring = RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ'));


		let newWiring: RotorWiring = wiring;

		// EKMFLGDQVZNTOWYHXUSPAIBRCJ -> FLNGMHERWAOUPXZIYVTQBJCSDK
		newWiring = newWiring.shift();
		expect(newWiring.input.letters).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		expect(newWiring.output.letters).toEqual('FLNGMHERWAOUPXZIYVTQBJCSDK');

		// FLNGMHERWAOUPXZIYVTQBJCSDK -> GMOHNIFSXBPVQYAJZWURCKDTEL
		newWiring = newWiring.shift();
		expect(newWiring.input.letters).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		expect(newWiring.output.letters).toEqual('GMOHNIFSXBPVQYAJZWURCKDTEL');
	});

	test('Can rotate wiring', () => {
		const wiring = RotorWiring.withEnglish(new Alphabet('GMOHNIFSXBPVQYAJZWURCKDTEL'));

		let newWiring: RotorWiring = wiring;

		// GMOHNIFSXBPVQYAJZWURCKDTEL -> LGMOHNIFSXBPVQYAJZWURCKDTE
		newWiring = newWiring.rotate();
		expect(newWiring.input.letters).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		expect(newWiring.output.letters).toEqual('LGMOHNIFSXBPVQYAJZWURCKDTE');

		// LGMOHNIFSXBPVQYAJZWURCKDTE -> ELGMOHNIFSXBPVQYAJZWURCKDT
		newWiring = newWiring.rotate();
		expect(newWiring.input.letters).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		expect(newWiring.output.letters).toEqual('ELGMOHNIFSXBPVQYAJZWURCKDT');
	});

	test('Can convert to string', () => {
		const wiring = RotorWiring.withEnglish(new Alphabet('GMOHNIFSXBPVQYAJZWURCKDTEL'));

		expect(wiring.toString()).toEqual(`
		ABCDEFGHIJKLMNOPQRSTUVWXYZ
		GMOHNIFSXBPVQYAJZWURCKDTEL
		`);
	});
});
