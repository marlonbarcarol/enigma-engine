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

	test('deleting characters re-enciphers instead of leaving stale ciphertext', () => {
		render(<App />);

		const input = screen.getByTestId('plaintext-input');
		fireEvent.change(input, { target: { value: 'NEVER' } });
		const fiveLetters = screen.getByTestId('ciphertext-output').textContent ?? '';

		fireEvent.change(input, { target: { value: 'NEV' } });

		expect(screen.getByTestId('ciphertext-output')).toHaveTextContent(fiveLetters.slice(0, 3));
		expect(screen.getByTestId('ciphertext-output').textContent).toHaveLength(3);
	});

	test('reset clears the message and the ciphertext', () => {
		render(<App />);

		fireEvent.change(screen.getByTestId('plaintext-input'), { target: { value: 'ENIGMA' } });
		expect(screen.getByTestId('ciphertext-output').textContent).not.toEqual('');

		fireEvent.click(screen.getByTestId('reset'));

		expect(screen.getByTestId('plaintext-input')).toHaveValue('');
		expect(screen.getByTestId('ciphertext-output').textContent).toEqual('');
	});
});
