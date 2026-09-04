import { Cipher, CipherTraceStep } from '@enigmaciphy/engine';
import { useCallback, useMemo, useState } from 'react';
import { ALPHABET, buildCipherOptions, DEFAULT_SETTINGS, MachineSettings } from '../config';

export interface UseCipherResult {
	/** The plaintext as typed, including characters the machine can't encipher. */
	message: string;
	setMessage: (message: string) => void;
	/** Strike a single key, as on the machine itself. */
	pressKey: (letter: string) => void;
	/** Clear the message and wind the rotors back to their starting positions. */
	reset: () => void;

	ciphertext: string;
	skippedCount: number;
	rotorPositions: string[];
	/** The key most recently struck, for the keyboard's pressed state. */
	lastInput: string | null;
	/** The letter most recently enciphered, for the lampboard's lit lamp. */
	lastOutput: string | null;
	lastTrace: CipherTraceStep[] | null;

	debugMode: boolean;
	setDebugMode: (value: boolean) => void;

	settings: MachineSettings;
	setSettings: (settings: MachineSettings) => void;
}

interface EncipherResult {
	ciphertext: string;
	skippedCount: number;
	rotorPositions: string[];
	lastInput: string | null;
	lastOutput: string | null;
	lastTrace: CipherTraceStep[] | null;
}

function currentRotorPositions(cipher: Cipher): string[] {
	return cipher.configuration.rotors.map((rotor) => rotor.wiring.input.at(rotor.cap()));
}

/**
 * Enciphers the whole message from a freshly-wound machine.
 *
 * The message is the source of truth rather than an append-only log, so editing
 * it (backspacing, pasting, clearing) re-runs the machine from its starting
 * position — which is what "encipher this text with these settings" means, and
 * what makes deleting a character behave the way anyone would expect.
 */
function encipher(message: string, settings: MachineSettings): EncipherResult {
	const cipher = Cipher.create(buildCipherOptions(settings));
	const wantsTrace = message.length > 0;

	let ciphertext = '';
	let skippedCount = 0;
	let lastInput: string | null = null;
	let lastOutput: string | null = null;
	let lastTrace: CipherTraceStep[] | null = null;

	for (const character of message.toUpperCase()) {
		if (!ALPHABET.includes(character)) {
			skippedCount += 1;
			continue;
		}

		const { output, trace } = cipher.encryptWithTrace(character);

		ciphertext += output;
		lastInput = character;
		lastOutput = output;
		lastTrace = wantsTrace ? trace : null;
	}

	return {
		ciphertext,
		skippedCount,
		rotorPositions: currentRotorPositions(cipher),
		lastInput,
		lastOutput,
		lastTrace,
	};
}

export function useCipher(): UseCipherResult {
	const [message, setMessage] = useState('');
	const [debugMode, setDebugMode] = useState(false);
	const [settings, setSettings] = useState<MachineSettings>(DEFAULT_SETTINGS);

	const result = useMemo(() => encipher(message, settings), [message, settings]);

	const pressKey = useCallback((letter: string) => {
		setMessage((previous) => previous + letter.toUpperCase());
	}, []);

	const reset = useCallback(() => {
		setMessage('');
	}, []);

	return useMemo(
		() => ({
			message,
			setMessage,
			pressKey,
			reset,
			ciphertext: result.ciphertext,
			skippedCount: result.skippedCount,
			rotorPositions: result.rotorPositions,
			lastInput: result.lastInput,
			lastOutput: result.lastOutput,
			lastTrace: result.lastTrace,
			debugMode,
			setDebugMode,
			settings,
			setSettings,
		}),
		[message, pressKey, reset, result, debugMode, settings],
	);
}
