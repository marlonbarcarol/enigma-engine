import { Alphabet } from '@/Configuration/Alphabet/Alphabet';
import { Rotor } from '@/Configuration/Rotor/Rotor';

class EnigmaConfiguration {
  public readonly alphabet: Alphabet;
  public readonly rotors: Rotor[];

  public constructor (
    alphabet: Alphabet,
    rotors: Rotor[],
  ) {
    this.alphabet = alphabet;
    this.rotors = rotors;
  }
}

export {
  EnigmaConfiguration,
};
