This is an implementation of the enigma machine encryption algorithm. The cipher heavily relies on substitution.

### Demo

An interactive visualizer that lets you type on a virtual Enigma machine and watch the rotors, reflector and plugboard react in real time (with an optional debug mode showing the signal's step-by-step path) is live at https://marlonbarcarol.github.io/enigma-engine/.

## Rotor

It substitutes an alphabet letter, representing the wiring of the rotor, the offset of the ring may be positioned in a different position of the alphabet. A letter may go through substitution throughout many rotors. Each time a letter is substited the rotor turns to the next letter.
Due to it's "turning" nature, a sequence of the same character will produce a different ciphertext for each turn.

### Rotor Notch

The point at which the next rotor position should be moved forward.

### Rotor processing representation

We will assume the position AAA and rings AAA as well as the following wiring alphabet.

```
Position          0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25
Alphabet          A  B  C  D  E  F  G  H  I  J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z
Shuffled Alphabet B  D  F  H  J  L  C  P  R  T  X  V  Z  N  Y  E  I  W  G  A  K  M  U  S  Q  O
```

So we initially have the following mapping `A=B, B=D, C=F, D=H, [...]`.

#### **Rotation**

Before processing anything the machine will rotate from 0 to 1.

#### **Wiring shift**

The mapping will happen from position 1 (A) outputing D.

```
                     ⬇️
Position          0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25
Alphabet          A  B  C  D  E  F  G  H  I  J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z
Shuffled Alphabet B  D  F  H  J  L  C  P  R  T  X  V  Z  N  Y  E  I  W  G  A  K  M  U  S  Q  O
```

#### **Rotor's position reverse shift**

The output D from the wiring shift, which is at alphabet position 3 will be subtracted by the rotor's position, 3 - 1 = 2, thus the final output will be the letter C, which is located at position 2.

## Reflector

Works like a bi-directional map. Unlike the rotors, the reflector does not turn as letters are processed, but its wiring can be given a starting offset (`position`), similar to the four-rotor M4 machine's repositionable thin reflector.

```
A maps B then
B maps A
```

## Plugboard

Maps a letter to another letter for its substitution, same property seem by the reflector. The major benefit is the possibility of mapping letters as needed, thus adding another layer of complexity to the cipher. The plugboard is applied before anything as well as after everything, meaning it is the first substitution and also the last, happening twice.

```
A maps B then
B maps A
```

## Usage:

```
npm install @enigmaciphy/engine
```

```ts
// -- ENCRYPTING
import { Cipher, CipherOptions } from '@enigmaciphy/engine';

const configuration: CipherOptions = {
	alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	plugboard: { wiring: 'AQRIJFHGDEWLTNSXBCOMZVKPYU' },
	entry: { wiring: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
	rotors: [
		{ wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notches: ['Q'], ring: 'A' },
		{ wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notches: ['E'], ring: 'A' },
		{ wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notches: ['V'], ring: 'A' },
	],
	reflector: { wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT', position: 'A' },
	chargroup: 5,
};
let cipher = Cipher.create(configuration);

cipher.encrypt('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
// XPJUP VYBRA QAJNY VAIXO UUWXO VVPDM LKVEK BHQIL DMAKH YL

// -- DECRYPTING

// To decrypt the cipher is instantiated again so the rotors will be on their initial position.
cipher = Cipher.create(configuration);

cipher.encrypt('XPJUP VYBRA QAJNY VAIXO UUWXO VVPDM LKVEK BHQIL DMAKH YL');
// LOREM IPSUM DOLOR SITAM ETCON SECTE TURAD IPISC INGEL IT
```

```ts
// -- TRACING A SINGLE CHARACTER
import { Cipher, CipherOptions } from '@enigmaciphy/engine';

const configuration: CipherOptions = {
	/* ...same shape as above... */
};
const cipher = Cipher.create(configuration);

const { output, trace } = cipher.encryptWithTrace('A');
```

`encryptWithTrace()` behaves like `encrypt()`, but only accepts exactly one character from the configured alphabet and returns `{ output, trace }` instead of a plain string:

- `output` is the resulting ciphertext letter, same as what `encrypt()` would produce for that character.
- `trace` is an ordered array of `CipherTraceStep` objects, one per stage the signal passes through on its way from plugboard to reflector and back (plugboard -> entry -> rotors (reverse) -> reflector -> rotors (forward) -> entry -> plugboard). Each step has a `component` (`'plugboard' | 'entry' | 'rotor' | 'reflector'`), the `input`/`output` letters at that stage, and, where relevant, an `index` (which rotor), a `direction` (`'in' | 'out' | 'reverse' | 'forward'`) and `rotorPosition` (the rotor's current-position letter).

---

The code output has been tested against the following existing machines:

- Universal Enigma: http://people.physik.hu-berlin.de/~palloks/js/enigma/enigma-u_v25_en.html
- Cryptii enigma machine: https://cryptii.com/pipes/enigma-machine

### Sources:

- Hackaday - THE ENIGMA ENIGMA: HOW THE ENIGMA MACHINE WORKED: https://hackaday.com/2017/08/22/the-enigma-enigma-how-the-enigma-machine-worked/
- CryptoMuseum - Enigma wiring: https://www.cryptomuseum.com/crypto/enigma/wiring.htm
- Enigma rotation example: https://crypto.stackexchange.com/a/71233/81146
- A1: Enigma https://www.cs.cornell.edu/courses/cs3110/2018sp/a1/a1.html
- Detailed working through of Enigma encipherment: https://www.codesandciphers.org.uk/enigma/example1.htm

### Debug

**VSCode example**
`F1` > `Debug: Toggle Auto Attach` > `Always` > inside vscode own terminal > `node --inspect ./node_modules/.bin/jest src/Configuration/Rotor/Rotor.spec.ts`
