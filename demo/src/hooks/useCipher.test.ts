import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useCipher } from './useCipher';

describe('useCipher', () => {
	test('pressKey updates the ciphertext and tracks skipped characters', () => {
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

	test('debug mode populates lastTrace after a keypress', () => {
		const { result } = renderHook(() => useCipher());

		expect(result.current.lastTrace).toBeNull();

		act(() => {
			result.current.setDebugMode(true);
		});

		act(() => {
			result.current.pressKey('N');
		});

		expect(result.current.lastTrace).not.toBeNull();
		expect(result.current.lastTrace).toHaveLength(11);
	});

	test('encrypting the full phrase matches the verified reference ciphertext', () => {
		const { result } = renderHook(() => useCipher());

		act(() => {
			for (const letter of 'NEVER GONNA GIVE YOU UP') {
				result.current.pressKey(letter);
			}
		});

		expect(result.current.ciphertext).toEqual('YQBUNEVTVMPZZWRISJW');
	});
});
