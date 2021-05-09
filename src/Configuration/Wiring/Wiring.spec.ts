import { Alphabet } from '../Alphabet/Alphabet';
import { InvalidWiringAssociationError } from './Error/InvalidWiringAssociationError';
import { InvalidWiringLengthError } from './Error/InvalidWiringLengthError';
import { Wiring } from './Wiring';

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

		test('with non associated characters', () => {
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

		test('with non ordered characters', () => {
			const wiring = new Wiring(new Alphabet('FEDCBA'), new Alphabet('ABCDEF'));

			expect(wiring).toBeInstanceOf(Wiring);
		});
	});

	test('Cannot map from out of range input position', () => {
		const wiring = new Wiring(new Alphabet('FEDCBA'), new Alphabet('ABCDEF'));

		expect(wiring.getInputMappedCharAt.bind(wiring, 6)).toThrow();
	});

	test('Can map from input position', () => {
		const wiring = new Wiring(new Alphabet('ABCDEF'), new Alphabet('CFAEBD'));

		expect(wiring.getInputMappedCharAt(0)).toBe('C');
		expect(wiring.getInputMappedCharAt(1)).toBe('F');
		expect(wiring.getInputMappedCharAt(2)).toBe('A');
		expect(wiring.getInputMappedCharAt(3)).toBe('E');
		expect(wiring.getInputMappedCharAt(4)).toBe('B');
		expect(wiring.getInputMappedCharAt(5)).toBe('D');
	});

	test('Cannot map from out of range output position', () => {
		const wiring = new Wiring(new Alphabet('ABCDEF'), new Alphabet('CFAEBD'));

		expect(wiring.getOutputMappedCharAt.bind(wiring, 6)).toThrowError();
	});

	test('Can map from output position', () => {
		const wiring = new Wiring(new Alphabet('ABCDEF'), new Alphabet('CFAEBD'));

		expect(wiring.getOutputMappedCharAt(0)).toBe('C');
		expect(wiring.getOutputMappedCharAt(1)).toBe('E');
		expect(wiring.getOutputMappedCharAt(2)).toBe('A');
		expect(wiring.getOutputMappedCharAt(3)).toBe('F');
		expect(wiring.getOutputMappedCharAt(4)).toBe('D');
		expect(wiring.getOutputMappedCharAt(5)).toBe('B');
	});
});
