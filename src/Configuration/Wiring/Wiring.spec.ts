import { Alphabet } from '@/Configuration/Alphabet/Alphabet';
import { InvalidWiringAssociationError } from '@/Configuration/Wiring/Error/InvalidWiringAssociationError';
import { InvalidWiringLengthError } from '@/Configuration/Wiring/Error/InvalidWiringLengthError';
import { Wiring } from '@/Configuration/Wiring/Wiring';

describe('Wiring.ts', () => {
	describe('Cannot instantiate', () => {
		test('with longer input than output', () => {
			const input = new Alphabet('ABCDE');
			const output = new Alphabet('ABCDEF');

			expect(() => new Wiring(input, output)).toThrowError(InvalidWiringLengthError);
		});

		test('with longer output than input', () => {
			const input = new Alphabet('ABCDEF');
			const output = new Alphabet('ABCDE');

			expect(() => new Wiring(input, output)).toThrowError(InvalidWiringLengthError);
		});

		test('with non associated characteres', () => {
			let output: Alphabet;
			let input: Alphabet;

			input = new Alphabet('QIWUDC');
			output = new Alphabet('ABCDEF');
			expect(() => new Wiring(input, output)).toThrowError(InvalidWiringAssociationError);

			input = new Alphabet('ABDEFG');
			output = new Alphabet('ABCDEF');
			expect(() => new Wiring(input, output)).toThrowError(InvalidWiringAssociationError);
		});
	});

	describe('Can instantiate', () => {
		test('with common wiring', () => {
			const input = Alphabet.createEnglish();
			const output = new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ');

			expect(new Wiring(input, output)).toBeInstanceOf(Wiring);
		});

		test('with non ordered characteres', () => {
			const input = new Alphabet('FEDCBA');
			const output = new Alphabet('ABCDEF');

			expect(new Wiring(input, output)).toBeInstanceOf(Wiring);
		});
	});

	test('Cannot map from out of range input position', () => {
		const input = new Alphabet('FEDCBA');
		const output = new Alphabet('ABCDEF');

		const wiring = new Wiring(input, output);

		expect(wiring.getInputMappedCharAt.bind(wiring, 6)).toThrow();
	});

	test('Can map from input position', () => {
		const input = new Alphabet('FEDCBA');
		const output = new Alphabet('ABCDEF');

		const wiring = new Wiring(input, output);

		expect(wiring.getInputMappedCharAt(0)).toBe('A');
		expect(wiring.getInputMappedCharAt(1)).toBe('B');
		expect(wiring.getInputMappedCharAt(2)).toBe('C');
		expect(wiring.getInputMappedCharAt(3)).toBe('D');
		expect(wiring.getInputMappedCharAt(4)).toBe('E');
		expect(wiring.getInputMappedCharAt(5)).toBe('F');
	});

	test('Cannot map from out of range output position', () => {
		const input = new Alphabet('FEDCBA');
		const output = new Alphabet('ABCDEF');

		const wiring = new Wiring(input, output);

		expect(wiring.getOutputMappedCharAt.bind(wiring, 6)).toThrowError();
	});

	test('Can map from output position', () => {
		const input = new Alphabet('FEDCBA');
		const output = new Alphabet('ABCDEF');

		const wiring = new Wiring(input, output);

		expect(wiring.getOutputMappedCharAt(0)).toBe('A');
		expect(wiring.getOutputMappedCharAt(1)).toBe('B');
		expect(wiring.getOutputMappedCharAt(2)).toBe('C');
		expect(wiring.getOutputMappedCharAt(3)).toBe('D');
		expect(wiring.getOutputMappedCharAt(4)).toBe('E');
		expect(wiring.getOutputMappedCharAt(5)).toBe('F');
	});
});
