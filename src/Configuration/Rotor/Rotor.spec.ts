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

	describe('Can rotate', () => {
		test('with few rotations', () => {
			const ring = new RotorRing(Alphabet.createEnglish().positionOf('A'));
			const rotors: Rotor[] = [
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')), 0, ['Q']),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')), 0, ['E']),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')), 0, ['V']),
			];

			rotors[0].connect(null, rotors[1]);
			rotors[1].connect(rotors[0], rotors[2]);
			rotors[2].connect(rotors[1], null);

			for (let index = 0; index < 100; index++) {
				rotors[2].rotate();
			}

			expect(rotors[0].pointer).toBe(0);
			expect(rotors[1].pointer).toBe(4);
			expect(rotors[2].pointer).toBe(100);
		});

		test('with connected rotors', () => {
			const ring = new RotorRing(Alphabet.createEnglish().positionOf('A'));
			const rotors: Rotor[] = [
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')), 0, ['Q']),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')), 0, ['E']),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')), 0, ['V']),
			];

			rotors[0].connect(null, rotors[1]);
			rotors[1].connect(rotors[0], rotors[2]);
			rotors[2].connect(rotors[1], null);

			for (let index = 0; index < 1300; index++) {
				rotors[2].rotate();
			}

			expect([rotors[0].pointer, rotors[1].pointer, rotors[2].pointer]).toStrictEqual([2, 52, 1300]);

			expect('ABCDEFGHIJKLMNOPQRSTUVWXYZ'[rotors[0].pointer % 26]).toBe('C');
			expect('ABCDEFGHIJKLMNOPQRSTUVWXYZ'[rotors[1].pointer % 26]).toBe('A');
			expect('ABCDEFGHIJKLMNOPQRSTUVWXYZ'[rotors[2].pointer % 26]).toBe('A');
		});

		test('on correct notches', () => {
			const ring = new RotorRing(Alphabet.createEnglish().positionOf('A'));
			const rotors: Rotor[] = [
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')), 0, ['Q']),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')), 0, ['E']),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')), 0, ['V']),
			];

			rotors[0].connect(null, rotors[1]);
			rotors[1].connect(rotors[0], rotors[2]);
			rotors[2].connect(rotors[1], null);

			const rotor1Rotation = rotors[0].rotate.bind(rotors[0]);
			const rotor2Rotation = rotors[1].rotate.bind(rotors[1]);
			const rotor3Rotation = rotors[2].rotate.bind(rotors[2]);
			rotors[0].rotate = function () {
				rotor1Rotation();
				expect(this.wiring.input.at(this.cap())).toEqual('Q');
			};
			rotors[1].rotate = function () {
				rotor2Rotation();
				expect(this.wiring.input.at(this.cap())).toEqual('V');
			};
			rotors[2].rotate = function () {
				rotor3Rotation();
			};

			for (let index = 0; index < 1300; index++) {
				rotors[2].rotate();
			}
		});
	});

	test('Can process', () => {
		const ring = new RotorRing(Alphabet.createEnglish().positionOf('A'));
		const wiring = RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO'));
		const rotor = new Rotor(ring, wiring, 0);

		rotor.configureRingWiring();

		let characters = '';

		const expected = 'CDEFGWIJKNKNAKPSFOHQRYVSPBCDEFGWI';

		for (let index = 0; index < expected.length; index++) {
			characters = characters.concat(rotor.process('A'));
		}

		expect(characters).toBe(expected);
	});
});
