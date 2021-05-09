import { Alphabet } from '../Alphabet/Alphabet';
import { RotorWiring, RotorWiringDirectionEnum } from './RotorWiring';

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

	test('Can rotate wiring input', () => {
		const wiring = RotorWiring.withEnglish(new Alphabet('GMOHNIFSXBPVQYAJZWURCKDTEL'));

		let newWiring: RotorWiring = wiring;

		expect(newWiring.input.characters).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		expect(newWiring.output.characters).toEqual('GMOHNIFSXBPVQYAJZWURCKDTEL');

		// ABCDEFGHIJKLMNOPQRSTUVWXYZ -> BCDEFGHIJKLMNOPQRSTUVWXYZA
		newWiring = newWiring.rotateInput(RotorWiringDirectionEnum.FORWARD);
		expect(newWiring.input.characters).toEqual('BCDEFGHIJKLMNOPQRSTUVWXYZA');
		expect(newWiring.output.characters).toEqual('GMOHNIFSXBPVQYAJZWURCKDTEL');

		// BCDEFGHIJKLMNOPQRSTUVWXYZA -> CDEFGHIJKLMNOPQRSTUVWXYZAB
		newWiring = newWiring.rotateInput(RotorWiringDirectionEnum.FORWARD);
		expect(newWiring.input.characters).toEqual('CDEFGHIJKLMNOPQRSTUVWXYZAB');
		expect(newWiring.output.characters).toEqual('GMOHNIFSXBPVQYAJZWURCKDTEL');
	});

	test('Can rotate wiring output', () => {
		const wiring = RotorWiring.withEnglish(new Alphabet('GMOHNIFSXBPVQYAJZWURCKDTEL'));

		let newWiring: RotorWiring = wiring;

		expect(newWiring.input.characters).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		expect(newWiring.output.characters).toEqual('GMOHNIFSXBPVQYAJZWURCKDTEL');

		// GMOHNIFSXBPVQYAJZWURCKDTEL -> LGMOHNIFSXBPVQYAJZWURCKDTE
		newWiring = newWiring.rotateOutput(RotorWiringDirectionEnum.BACKWARD);
		expect(newWiring.input.characters).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		expect(newWiring.output.characters).toEqual('LGMOHNIFSXBPVQYAJZWURCKDTE');

		// LGMOHNIFSXBPVQYAJZWURCKDTE -> ELGMOHNIFSXBPVQYAJZWURCKDT
		newWiring = newWiring.rotateOutput(RotorWiringDirectionEnum.BACKWARD);
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
