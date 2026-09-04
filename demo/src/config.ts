import { CipherOptions } from '@enigmaciphy/engine';

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * The Enigma's keyboard, lampboard and plugboard all share this layout — the
 * German QWERTZ arrangement, not QWERTY.
 */
export const QWERTZ_ROWS: readonly (readonly string[])[] = [
	['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O'],
	['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'],
	['P', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'L'],
];

export interface RotorSpec {
	id: string;
	wiring: string;
	notch: string;
}

/** The five rotors issued with the Wehrmacht Enigma I. */
export const ROTOR_CATALOG: readonly RotorSpec[] = [
	{ id: 'I', wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
	{ id: 'II', wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
	{ id: 'III', wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' },
	{ id: 'IV', wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', notch: 'J' },
	{ id: 'V', wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK', notch: 'Z' },
];

export interface ReflectorSpec {
	id: string;
	wiring: string;
}

/** The reflectors (Umkehrwalzen) available on the same machine. */
export const REFLECTOR_CATALOG: readonly ReflectorSpec[] = [
	{ id: 'A', wiring: 'EJMZALYXVBWFCRQUONTSPIKHGD' },
	{ id: 'B', wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT' },
	{ id: 'C', wiring: 'FVPJIAOYEDRZXWGCTKUQSBNMHL' },
];

export interface MachineSettings {
	/** Rotor ids, left to right as mounted in the machine. */
	rotorIds: string[];
	/** Ringstellung — the ring setting for each rotor. */
	ringSettings: string[];
	/** Grundstellung — the starting position for each rotor. */
	positions: string[];
	reflectorId: string;
	plugboardPairs: [string, string][];
}

export const DEFAULT_SETTINGS: MachineSettings = {
	rotorIds: ['I', 'II', 'III'],
	ringSettings: ['A', 'A', 'A'],
	positions: ['A', 'A', 'A'],
	reflectorId: 'B',
	// The pairs encoded by the original demo's fixed plugboard wiring.
	plugboardPairs: [
		['B', 'Q'],
		['C', 'R'],
		['D', 'I'],
		['E', 'J'],
		['G', 'H'],
		['K', 'W'],
		['M', 'T'],
		['O', 'S'],
		['P', 'X'],
		['U', 'Z'],
	],
};

export const ROTOR_COUNT = DEFAULT_SETTINGS.rotorIds.length;

function rotorSpec(id: string): RotorSpec {
	return ROTOR_CATALOG.find((rotor) => rotor.id === id) ?? ROTOR_CATALOG[0];
}

function reflectorSpec(id: string): ReflectorSpec {
	return REFLECTOR_CATALOG.find((reflector) => reflector.id === id) ?? REFLECTOR_CATALOG[1];
}

/** Expands plugboard pairs into the full 26-character substitution wiring. */
export function plugboardWiring(pairs: readonly (readonly [string, string])[]): string {
	const wiring = Array.from(ALPHABET);

	for (const [from, to] of pairs) {
		wiring[ALPHABET.indexOf(from)] = to;
		wiring[ALPHABET.indexOf(to)] = from;
	}

	return wiring.join('');
}

/** Translates the operator-facing settings into the engine's configuration. */
export function buildCipherOptions(settings: MachineSettings): CipherOptions {
	return {
		alphabet: ALPHABET,
		plugboard: { wiring: plugboardWiring(settings.plugboardPairs) },
		entry: { wiring: ALPHABET },
		rotors: settings.rotorIds.map((id, index) => {
			const spec = rotorSpec(id);

			return {
				wiring: spec.wiring,
				notches: [spec.notch],
				ring: settings.ringSettings[index],
				position: settings.positions[index],
			};
		}),
		reflector: { wiring: reflectorSpec(settings.reflectorId).wiring },
	};
}

/** Every letter that currently has a plugboard cable attached to it. */
export function pluggedLetters(pairs: readonly (readonly [string, string])[]): ReadonlySet<string> {
	return new Set(pairs.flat());
}
