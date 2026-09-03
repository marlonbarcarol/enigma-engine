import { Alphabet } from '../Alphabet/Alphabet';
import { Wiring } from '../Wiring/Wiring';
import { Reflector } from './Reflector';

describe('Reflector.ts', () => {
	test('Defaults to pointer 0, matching the wiring as given', () => {
		const wiring = Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT'));
		const reflector = new Reflector(wiring);

		expect(reflector.pointer).toEqual(0);
		expect(reflector.process('A')).toEqual('Y');
	});

	test('Can be constructed with a starting pointer, offsetting the wiring', () => {
		const wiring = Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT'));
		const reflector = new Reflector(wiring, 3);

		expect(reflector.pointer).toEqual(3);
		expect(reflector.process('A')).toEqual('E');
		expect(reflector.process('Q')).toEqual('W');
		expect(reflector.process('Z')).toEqual('R');
	});

	test('rotate() advances the pointer, offsetting subsequent processing', () => {
		const wiring = Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT'));
		const reflector = new Reflector(wiring);

		reflector.rotate();
		reflector.rotate();
		reflector.rotate();

		expect(reflector.pointer).toEqual(3);
		expect(reflector.process('A')).toEqual('E');
	});

	test('rotate() N times is equivalent to constructing with that pointer', () => {
		const wiring = Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT'));

		const rotated = new Reflector(wiring);
		for (let i = 0; i < 5; i++) {
			rotated.rotate();
		}

		const constructed = new Reflector(wiring, 5);

		expect(rotated.process('M')).toEqual(constructed.process('M'));
	});
});
