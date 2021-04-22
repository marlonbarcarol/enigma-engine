import { Alphabet } from '@/Configuration/Alphabet/Alphabet';

describe('Alphabet.ts', () => {
	describe('Can instantiate', () => {
		test('with few characters', () => {
			expect(new Alphabet('ABCDE')).toBeInstanceOf(Alphabet);
		});

		test('with english alphabet', () => {
			const alphabet = Alphabet.createEnglish();

			expect(alphabet).toBeInstanceOf(Alphabet);
			expect(alphabet.characters).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
		});

		test('with any casing', () => {
			const alphabet = new Alphabet('aBcDEFG');
			expect(alphabet.characters).toBe('ABCDEFG');
		});
	});

	describe('Can order', () => {
		test('with few characters', () => {
			const alphabet = new Alphabet('ACBDE');

			expect(alphabet.order()).toBe('ABCDE');
		});

		test('with any casing', () => {
			const alphabet = new Alphabet('aBcDEFG');
			expect(alphabet.order()).toBe('ABCDEFG');
		});
	});

	test('Can obtain a character position', () => {
		const alphabet = new Alphabet('aBcDEFG');
		expect(alphabet.positionOf('F')).toBe(5);
	});

	test('Can obtain the position of a character', () => {
		const alphabet = new Alphabet('aBcDEFG');
		expect(alphabet.at(5)).toBe('F');
	});
});
