describe('EnigmaCipher.ts', () => {
	function sum(a: number, b: number) {
		return a + b;
	}

	test('adds 1 + 2 to equal 3', () => {
		expect(sum(1, 2)).toBe(3);
	});

	test('adds 1 + 2 to equal 5', () => {
		expect(sum(1, 2)).toBe(4);
	});
});
