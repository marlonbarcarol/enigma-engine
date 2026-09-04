import { CipherOptions } from '@enigmaciphy/engine';

export const MACHINE_CONFIG: CipherOptions = {
	alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	plugboard: { wiring: 'AQRIJFHGDEWLTNSXBCOMZVKPYU' },
	entry: { wiring: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
	rotors: [
		{ wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notches: ['Q'] },
		{ wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notches: ['E'] },
		{ wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notches: ['V'] },
	],
	reflector: { wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT' },
};

export const ROTOR_COUNT = MACHINE_CONFIG.rotors.length;

/**
 * The Enigma's keyboard, lampboard and plugboard all share this layout — the
 * German QWERTZ arrangement, not QWERTY.
 */
export const QWERTZ_ROWS: readonly (readonly string[])[] = [
	['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O'],
	['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'],
	['P', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'L'],
];

/**
 * The letter pairs physically cross-patched on the plugboard, derived from the
 * configured wiring. Self-mapped letters (no cable) are omitted, and each pair
 * appears once rather than twice.
 */
export const PLUGBOARD_PAIRS: readonly (readonly [string, string])[] = (() => {
	const alphabet = MACHINE_CONFIG.alphabet;
	const wiring = MACHINE_CONFIG.plugboard?.wiring ?? alphabet;
	const pairs: [string, string][] = [];

	for (const [index, letter] of Array.from(alphabet).entries()) {
		const mapped = wiring[index];

		if (mapped !== letter && letter < mapped) {
			pairs.push([letter, mapped]);
		}
	}

	return pairs;
})();

/** Every letter that has a plugboard cable attached to it. */
export const PLUGGED_LETTERS: ReadonlySet<string> = new Set(PLUGBOARD_PAIRS.flat());
