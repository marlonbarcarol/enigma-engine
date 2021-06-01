import { Alphabet } from '../Alphabet/Alphabet';
import { Rotor } from './Rotor';
import { RotorWiring } from './RotorWiring';

describe('Rotor.ts', () => {
	test('Can configure wiring', () => {
		let wiring = RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ'));
		const rotor = new Rotor({ wiring });

		rotor.configureRingWiring();

		wiring = rotor.wiring;

		expect(wiring.input.characters).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		expect(wiring.output.characters).toEqual('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
	});

	describe('Can rotate', () => {
		test('with few rotations', () => {
			const rotors: Rotor[] = [
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')),
					notches: ['Q'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')),
					notches: ['E'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')),
					notches: ['V'],
				}),
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
			const rotors: Rotor[] = [
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')),
					notches: ['Q'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')),
					notches: ['E'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')),
					notches: ['V'],
				}),
			];

			rotors[0].connect(null, rotors[1]);
			rotors[1].connect(rotors[0], rotors[2]);
			rotors[2].connect(rotors[1], null);

			for (let index = 0; index < 1300; index++) {
				rotors[2].rotate();
			}

			expect([rotors[0].pointer, rotors[1].pointer, rotors[2].pointer]).toStrictEqual([
				2, 52, 1300,
			]);

			expect('ABCDEFGHIJKLMNOPQRSTUVWXYZ'[rotors[0].pointer % 26]).toBe('C');
			expect('ABCDEFGHIJKLMNOPQRSTUVWXYZ'[rotors[1].pointer % 26]).toBe('A');
			expect('ABCDEFGHIJKLMNOPQRSTUVWXYZ'[rotors[2].pointer % 26]).toBe('A');
		});

		test('on correct notches', () => {
			const rotors: Rotor[] = [
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')),
					notches: ['Q'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')),
					notches: ['E'],
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')),
					notches: ['V'],
				}),
			];

			rotors[0].connect(null, rotors[1]);
			rotors[1].connect(rotors[0], rotors[2]);
			rotors[2].connect(rotors[1], null);

			const rotor1Rotation = rotors[0].rotate.bind(rotors[0]);
			const rotor2Rotation = rotors[1].rotate.bind(rotors[1]);
			const rotor3Rotation = rotors[2].rotate.bind(rotors[2]);
			rotors[0].rotate = function (): void {
				rotor1Rotation();
				if (this.connection.previous === null) {
					throw new Error('Expected previous connection');
				}
				expect(this.wiring.input.at(this.connection.previous.cap())).toEqual('E');
			};
			rotors[1].rotate = function (): void {
				rotor2Rotation();
				if (this.connection.previous === null || this.connection.next === null) {
					throw new Error('Expected next/previous connection');
				}

				const current = this.wiring.input.at(this.cap());
				const previous = this.wiring.input.at(this.connection.previous.cap());

				// cause double stepping
				expect(current === 'F' || previous === 'V').toBeTruthy();
			};
			rotors[2].rotate = function (): void {
				rotor3Rotation();
			};

			for (let index = 0; index < 1300; index++) {
				rotors[2].rotate();
			}
		});
	});
	describe('Cannot rotate', () => {
		test('with lock mechanism', () => {
			const rotors: Rotor[] = [
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')),
					notches: ['Q'],
					lock: true,
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')),
					notches: ['E'],
					lock: true,
				}),
				new Rotor({
					wiring: RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')),
					notches: ['V'],
					lock: true,
				}),
			];

			rotors[0].connect(null, rotors[1]);
			rotors[1].connect(rotors[0], rotors[2]);
			rotors[2].connect(rotors[1], null);

			const rotor1Rotation = jest.fn(rotors[0].rotate.bind(rotors[0]));
			expect(rotor1Rotation).not.toHaveBeenCalled();

			const rotor2Rotation = jest.fn(rotors[1].rotate.bind(rotors[1]));
			expect(rotor2Rotation).not.toHaveBeenCalled();

			const rotor3Rotation = jest.fn(rotors[2].rotate.bind(rotors[2]));
			expect(rotor3Rotation).not.toHaveBeenCalled();

			for (let index = 0; index < 1300; index++) {
				rotors[2].process('A');
			}
		});
	});

	test('Can process', () => {
		const wiring = RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO'));
		const rotor = new Rotor({ wiring });

		rotor.configureRingWiring();

		let characters = '';

		const expected = 'CDEFGWIJKNKNAKPSFOHQRYVSPBCDEFGWI';

		for (let index = 0; index < expected.length; index++) {
			characters = characters.concat(rotor.process('A'));
		}

		expect(characters).toBe(expected);
	});
});
