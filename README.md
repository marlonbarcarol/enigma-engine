This is an implementation of an encryption algorithm mimicking the enigma machine. The machine which was popularized through "The Imitation Game" movie.

The cypher heavily relies on substitution.

# Instalation
```
npm install
```

## Rotor
It substitutes an alphabet letter, representing the wiring of the rotor, the offset of the ring may be positioned in a different position of the alphabet. A letter may go through substitution throughout many rotors. Each time a letter is substited the rotor turns to the next letter.
Due to it's "turning" nature, a sequence of the same character will produce a different ciphertext for each turn.

## Rotor representation
**Exposed ring alphabet**
```
Alphabet          A  B  C  D  E  F  G  H  I J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z
Position          0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25
```
**Wired alphabet**
```
Shuffled Alphabet Q  W  E  R  T  Z  U  I  O  A  S  D  F  G  H  J  K  P  Y  X  C  V  B  N  M  L
Position          0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25
```
Resulting on `A=Q, B=W, C=E, D=R, [...]`.

# Reflector
Works like a bi-directional map. The reflector is fixed and non configurable as oposed to the rotor rings.
```
A maps B then
B maps A
```

# Plugboard
Maps a letter to another letter for theirs substitution, same property seem by the reflector. The major benefit is the possibility of having many letters mapped, thus adding another complexity as well as layer to the cypher.

```
A maps B then
B maps A
```

#### Sources:
- Hackaday - THE ENIGMA ENIGMA: HOW THE ENIGMA MACHINE WORKED: https://hackaday.com/2017/08/22/the-enigma-enigma-how-the-enigma-machine-worked/
- CryptoMuseum - Enigma wiring: https://www.cryptomuseum.com/crypto/enigma/wiring.htm
- A1: Enigma https://www.cs.cornell.edu/courses/cs3110/2018sp/a1/a1.html
-  detailed working through of Enigma encipherment: https://www.codesandciphers.org.uk/enigma/example1.htm
