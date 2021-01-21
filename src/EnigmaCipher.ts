import { EnigmaConfiguration } from '@/Configuration/EnigmaConfiguration';


class EngimaCipher {
  public readonly configuration: EnigmaConfiguration;

  public constructor (configuration: EnigmaConfiguration) {
    this.configuration = configuration;
  }

  /**
   * Enigma machine is actually a symmetrical cipher,
   * meaning the decryption method is the same as the encryption.
   */
  public encrypt(plaintext: string): string {
    let treatedText = plaintext.toUpperCase();

    const regex = new RegExp(`[^${this.configuration.alphabet.letters}]+`, 'gm');
    treatedText = treatedText.replace(regex, '');

    if (treatedText.length === 0) {
      return '';
    }

    // TODO - Use generators
    let textArray = treatedText.split('');

    textArray = textArray.map((letter: string): string => {
      const result = '';

      for (const rotor of this.configuration.rotors) {
        for (const r of rotor) {
          r.process(letter);
        }
      }

      return result;
    });

    const text = textArray.join('');

    return text;
  }
}

export {
  EngimaCipher,
};
