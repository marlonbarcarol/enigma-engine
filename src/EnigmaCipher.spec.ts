import { Alphabet } from '@/Configuration/Alphabet/Alphabet';
import { EnigmaConfiguration } from '@/Configuration/EnigmaConfiguration';
import { Plugboard } from '@/Configuration/Plugboard/Plugboard';
import { Reflector } from '@/Configuration/Reflector/Reflector';
import { Rotor } from '@/Configuration/Rotor/Rotor';
import { RotorRing } from '@/Configuration/Rotor/RotorRing';
import { RotorWiring } from '@/Configuration/Rotor/RotorWiring';
import { Wheel } from '@/Configuration/Wheel/Wheel';
import { Wiring } from '@/Configuration/Wiring/Wiring';
import { EnigmaCipher } from '@/EnigmaCipher';

describe('EnigmaCipher.ts', () => {
	test('Can instantiate', () => {
		const alphabet = Alphabet.createEnglish();

		const ring = new RotorRing(alphabet.positionOf('A'));
		const rotors: Rotor[] = [
			new Rotor(ring, RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')), 0),
			new Rotor(ring, RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')), 0),
			new Rotor(ring, RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')), 0),
		];

		const plugboard = new Plugboard(Wiring.withEnglish(alphabet));
		const entry = new Wheel(Wiring.withEnglish(alphabet));
		const reflector = new Reflector(Wiring.withEnglish(alphabet));

		const configuration: EnigmaConfiguration = {
			alphabet,
			plugboard,
			entry,
			rotors,
			reflector,
		};

		const cipher = new EnigmaCipher(configuration);

		expect(cipher).toBeInstanceOf(EnigmaCipher);
	});

	test('Can encrypt', () => {
		const alphabet = Alphabet.createEnglish();

		const ring = new RotorRing(alphabet.positionOf('A'));
		const rotors: Rotor[] = [
			// ABCDEFGHIJKLMNOPQRSTUVWXYZ
			new Rotor(ring, RotorWiring.withEnglish(new Alphabet('EKMFLGDQVZNTOWYHXUSPAIBRCJ')), 0),
			// ABCDEFGHIJKLMNOPQRSTUVWXYZ
			new Rotor(ring, RotorWiring.withEnglish(new Alphabet('AJDKSIRUXBLHWTMCQGZNPYFVOE')), 0),
			new Rotor(ring, RotorWiring.withEnglish(new Alphabet('BDFHJLCPRTXVZNYEIWGAKMUSQO')), 0),
			// ABCDEFGHIJKLMNOPQRSTUVWXYZ
		];

		const plugboard = new Plugboard(Wiring.withEnglish(Alphabet.createEnglish()));
		const entry = new Wheel(Wiring.withEnglish(Alphabet.createEnglish()));
		const reflector = new Reflector(Wiring.withEnglish(new Alphabet('YRUHQSLDPXNGOKMIEBFZCWVJAT')));

		const configuration: EnigmaConfiguration = {
			alphabet,
			plugboard,
			entry,
			rotors,
			reflector,
		};

		const cipher = new EnigmaCipher(configuration);

		expect(cipher.encrypt('AAAAA')).toEqual('BDZGO');
	});
});
