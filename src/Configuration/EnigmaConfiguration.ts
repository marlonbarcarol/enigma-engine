import { Alphabet } from '@/Configuration/Alphabet/Alphabet';
import { Plugboard } from '@/Configuration/Plugboard/Plugboard';
import { Reflector } from '@/Configuration/Reflector/Reflector';
import { Rotor } from '@/Configuration/Rotor/Rotor';
import { Wheel } from '@/Configuration/Wheel/Wheel';

export interface EnigmaConfiguration {
	readonly alphabet: Alphabet;
	readonly plugboard: Plugboard;
	readonly entry: Wheel;
	readonly rotors: Rotor[];
	readonly reflector: Reflector;
}
