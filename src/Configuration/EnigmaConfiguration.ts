import { Alphabet } from './../Configuration/Alphabet/Alphabet';
import { Plugboard } from './../Configuration/Plugboard/Plugboard';
import { Reflector } from './../Configuration/Reflector/Reflector';
import { Rotor } from './../Configuration/Rotor/Rotor';
import { Wheel } from './../Configuration/Wheel/Wheel';
import { Nullable } from './../types/type';

export interface EnigmaConfiguration {
	readonly alphabet: Alphabet;
	readonly plugboard?: Nullable<Plugboard>;
	readonly entry?: Nullable<Wheel>;
	readonly rotors: Rotor[];
	readonly reflector?: Nullable<Reflector>;
	readonly chargroup?: Nullable<number>;
}
