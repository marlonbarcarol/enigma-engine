// demo/src/App.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import App from './App';

describe('App', () => {
	test('typing updates the ciphertext output', () => {
		render(<App />);

		const input = screen.getByTestId('plaintext-input');
		fireEvent.change(input, { target: { value: 'N' } });

		expect(screen.getByTestId('ciphertext-output')).toHaveTextContent('Y');
	});

	test('typing a space increments the skipped-character count without adding ciphertext', () => {
		render(<App />);

		const input = screen.getByTestId('plaintext-input');
		fireEvent.change(input, { target: { value: 'N ' } });

		expect(screen.getByTestId('ciphertext-output')).toHaveTextContent('Y');
		expect(screen.getByTestId('skipped-count')).toHaveTextContent('1');
	});
});
