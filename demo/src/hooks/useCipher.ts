import { Cipher, CipherTraceStep, InvalidTraceLetterError } from '@enigmaciphy/engine';
import { useCallback, useMemo, useRef, useState } from 'react';
import { MACHINE_CONFIG, ROTOR_COUNT } from '../config';

export interface UseCipherResult {
	ciphertext: string;
	skippedCount: number;
	debugMode: boolean;
	setDebugMode: (value: boolean) => void;
	lastTrace: CipherTraceStep[] | null;
	rotorPositions: string[];
	pressKey: (letter: string) => void;
}

function currentRotorPositions(cipher: Cipher): string[] {
	return cipher.configuration.rotors.map((rotor) => rotor.wiring.input.at(rotor.cap()));
}

export function useCipher(): UseCipherResult {
	const cipherRef = useRef<Cipher | undefined>(undefined);
	if (!cipherRef.current) {
		cipherRef.current = Cipher.create(MACHINE_CONFIG);
	}

	const [ciphertext, setCiphertext] = useState('');
	const [skippedCount, setSkippedCount] = useState(0);
	const [debugMode, setDebugMode] = useState(false);
	const [lastTrace, setLastTrace] = useState<CipherTraceStep[] | null>(null);
	const [rotorPositions, setRotorPositions] = useState<string[]>(() =>
		Array(ROTOR_COUNT).fill('A'),
	);

	const pressKey = useCallback(
		(letter: string) => {
			const cipher = cipherRef.current as Cipher;

			if (debugMode) {
				try {
					const { output, trace } = cipher.encryptWithTrace(letter);
					setCiphertext((previous) => previous + output);
					setLastTrace(trace);
					setRotorPositions(currentRotorPositions(cipher));
					return;
				} catch (error) {
					if (!(error instanceof InvalidTraceLetterError)) {
						throw error;
					}

					setSkippedCount((previous) => previous + 1);
					return;
				}
			}

			const output = cipher.encrypt(letter);

			if (output.length === 0) {
				setSkippedCount((previous) => previous + 1);
				return;
			}

			setCiphertext((previous) => previous + output);
			setRotorPositions(currentRotorPositions(cipher));
		},
		[debugMode],
	);

	return useMemo(
		() => ({
			ciphertext,
			skippedCount,
			debugMode,
			setDebugMode,
			lastTrace,
			rotorPositions,
			pressKey,
		}),
		[ciphertext, skippedCount, debugMode, lastTrace, rotorPositions, pressKey],
	);
}
