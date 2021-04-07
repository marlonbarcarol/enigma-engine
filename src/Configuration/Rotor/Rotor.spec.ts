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

	xdescribe('Can rotate', () => {
		const ring = new RotorRing(Alphabet.createEnglish().positionOf('A'));
		const wiring = RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ'));
		const rotor = new Rotor(ring, wiring, wiring.input.positionOf('A'));

		rotor.configureRingWiring();

		for (let i = 0; i < 100; i++) {
			test(`Turning over #${i}`, () => {
				expect(rotor.pointer).toStrictEqual(i);
				rotor.rotate();
				expect(rotor.pointer).toStrictEqual(i + 1);
			});
		}

		test("with connected rotors", () => {
			const rotors: Rotor[] = [
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')), 0, [16]),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')), 0, [4]),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')), 0, [21]),
			];

			rotors[0].connect(null, rotors[1]);
			rotors[1].connect(rotors[0], rotors[2]);
			rotors[2].connect(rotors[1], null);

			for (let index = 0; index < 1300; index++) {
				rotors[2].rotate();
			}

			expect('ABCDEFGHIJKLMNOPQRSTUVWXYZ'[rotors[0].pointer % 26]).toBe('C')
			expect('ABCDEFGHIJKLMNOPQRSTUVWXYZ'[rotors[1].pointer % 26]).toBe('A')
			expect('ABCDEFGHIJKLMNOPQRSTUVWXYZ'[rotors[2].pointer % 26]).toBe('A')

			expect(rotors[0].pointer).toBe(2);
			expect(rotors[1].pointer).toBe(52);
			expect(rotors[2].pointer).toBe(1300);
		});

		test("on correct notches", () => {
			const rotors: Rotor[] = [
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')), 0, [16]),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')), 0, [4]),
				new Rotor(ring, RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')), 0, [21]),
			];

			rotors[0].connect(null, rotors[1]);
			rotors[1].connect(rotors[0], rotors[2]);
			rotors[2].connect(rotors[1], null);

			const rotationOriginal = rotors[0].rotate;
			rotors[0].rotate = function() {
				rotationOriginal.bind(this)();

				expect(this.wiring.input.at(this.cap())).toEqual('Q');
			};
			rotors[1].rotate = function() {
				rotationOriginal.bind(this)();

				expect(this.wiring.input.at(this.cap())).toEqual('V');
			};
			rotors[2].rotate = function() {
				rotationOriginal.bind(this)();
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

		let char: string;

 // const expected = 'CDEFGWIJKNKNAKPSFOHQRZWTQCDEFGHXJ';
		const expected = 'CDEFGWIJKNKNAKPSFOHQRYDTQCDEFGHXJ';

		for(const letter of expected) {
			char = rotor.process('A');
			expect(char).toEqual(letter);
		}
	});
});
