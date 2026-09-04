import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useCipher } from './useCipher';

describe('useCipher', () => {
	test('pressKey enciphers and tracks skipped characters', () => {
		const { result } = renderHook(() => useCipher());

		expect(result.current.ciphertext).toEqual('');

		act(() => {
			result.current.pressKey('N');
		});

		expect(result.current.ciphertext).toEqual('Y');
		expect(result.current.skippedCount).toEqual(0);

		act(() => {
			result.current.pressKey(' ');
		});

		expect(result.current.ciphertext).toEqual('Y');
		expect(result.current.skippedCount).toEqual(1);
	});

	test('populates the trace for the last enciphered letter', () => {
		const { result } = renderHook(() => useCipher());

		expect(result.current.lastTrace).toBeNull();

		act(() => {
			result.current.pressKey('N');
		});

		expect(result.current.lastTrace).toHaveLength(11);
	});

	test('encrypting the full phrase matches the verified reference ciphertext', () => {
		const { result } = renderHook(() => useCipher());

		act(() => {
			result.current.setMessage('NEVER GONNA GIVE YOU UP');
		});

		expect(result.current.ciphertext).toEqual('YQBUNEVTVMPZZWRISJW');
	});

	test('shortening the message re-enciphers from the start rather than leaving stale output', () => {
		const { result } = renderHook(() => useCipher());

		act(() => {
			result.current.setMessage('NEVER');
		});
		const fiveLetters = result.current.ciphertext;

		act(() => {
			result.current.setMessage('NEV');
		});

		// Deleting characters must wind the machine back, not append or freeze.
		expect(result.current.ciphertext).toEqual(fiveLetters.slice(0, 3));
	});

	test('reset clears the message and winds the rotors back', () => {
		const { result } = renderHook(() => useCipher());

		act(() => {
			result.current.setMessage('ENIGMA');
		});
		expect(result.current.rotorPositions).not.toEqual(['A', 'A', 'A']);

		act(() => {
			result.current.reset();
		});

		expect(result.current.message).toEqual('');
		expect(result.current.ciphertext).toEqual('');
		expect(result.current.rotorPositions).toEqual(['A', 'A', 'A']);
	});

	test('changing settings re-enciphers the same message differently', () => {
		const { result } = renderHook(() => useCipher());

		act(() => {
			result.current.setMessage('ENIGMA');
		});
		const withDefaults = result.current.ciphertext;

		act(() => {
			result.current.setSettings({
				...result.current.settings,
				rotorIds: ['IV', 'V', 'I'],
			});
		});

		expect(result.current.ciphertext).not.toEqual(withDefaults);
		expect(result.current.ciphertext).toHaveLength(withDefaults.length);
	});

	test('patching a plugboard cable changes the enciphered output', () => {
		const { result } = renderHook(() => useCipher());

		act(() => {
			result.current.setSettings({ ...result.current.settings, plugboardPairs: [] });
		});
		act(() => {
			result.current.setMessage('A');
		});

		expect(result.current.ciphertext).toEqual('B');

		act(() => {
			result.current.setSettings({
				...result.current.settings,
				plugboardPairs: [['A', 'C']],
			});
		});

		expect(result.current.ciphertext).toEqual('Q');
	});

	test('a cable across an already-reciprocal pair leaves that letter unchanged', () => {
		// With no cables the machine maps A <-> B. Patching a cable across that
		// same pair is a no-op for A: the cable swaps it to B on the way in, the
		// rotors map B back to A, and the cable swaps it to B again on the way
		// out. A real property of the machine, not a quirk of this demo.
		const { result } = renderHook(() => useCipher());

		act(() => {
			result.current.setSettings({ ...result.current.settings, plugboardPairs: [] });
		});
		act(() => {
			result.current.setMessage('A');
		});

		expect(result.current.ciphertext).toEqual('B');

		act(() => {
			result.current.setSettings({
				...result.current.settings,
				plugboardPairs: [['A', 'B']],
			});
		});

		expect(result.current.ciphertext).toEqual('B');
	});
});
