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
