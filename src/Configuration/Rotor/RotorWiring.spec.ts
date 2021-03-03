import { Alphabet } from '@/Configuration/Alphabet/Alphabet';
import { RotorWiring } from '@/Configuration/Rotor/RotorWiring';

describe('RotorWiring.ts', () => {
	test('Can shift wiring', () => {
		const wiring = RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ'));

		let newWiring: RotorWiring = wiring;

		// EKMFLGDQVZNTOWYHXUSPAIBRCJ -> FLNGMHERWAOUPXZIYVTQBJCSDK
		newWiring = newWiring.shiftUp();
		expect(newWiring.input.characters).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		expect(newWiring.output.characters).toEqual('FLNGMHERWAOUPXZIYVTQBJCSDK');

		// FLNGMHERWAOUPXZIYVTQBJCSDK -> GMOHNIFSXBPVQYAJZWURCKDTEL
		newWiring = newWiring.shiftUp();
		expect(newWiring.input.characters).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		expect(newWiring.output.characters).toEqual('GMOHNIFSXBPVQYAJZWURCKDTEL');
	});

	test('Can rotate wiring', () => {
		const wiring = RotorWiring.withEnglish(new Alphabet('GMOHNIFSXBPVQYAJZWURCKDTEL'));

		let newWiring: RotorWiring = wiring;

		// GMOHNIFSXBPVQYAJZWURCKDTEL -> LGMOHNIFSXBPVQYAJZWURCKDTE
		newWiring = newWiring.rotate();
		expect(newWiring.input.characters).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		expect(newWiring.output.characters).toEqual('LGMOHNIFSXBPVQYAJZWURCKDTE');

		// LGMOHNIFSXBPVQYAJZWURCKDTE -> ELGMOHNIFSXBPVQYAJZWURCKDT
		newWiring = newWiring.rotate();
		expect(newWiring.input.characters).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		expect(newWiring.output.characters).toEqual('ELGMOHNIFSXBPVQYAJZWURCKDT');
	});

	test('Can convert to string', () => {
		const wiring = RotorWiring.withEnglish(new Alphabet('GMOHNIFSXBPVQYAJZWURCKDTEL'));

		expect(wiring.toString()).toEqual(`
		ABCDEFGHIJKLMNOPQRSTUVWXYZ
		GMOHNIFSXBPVQYAJZWURCKDTEL
		`);
	});
});
