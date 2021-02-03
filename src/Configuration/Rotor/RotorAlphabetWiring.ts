import { Alphabet } from '@/Configuration/Alphabet/Alphabet';

// A rotor contains a ring alphabet wired to a shuffled alphabet.
class RotorAlphabetWiring {
	// The ring alphabet.
	public readonly ring: Alphabet;

	// The alphabet sequence that the ring alphabet is wired to.
	public readonly wired: Alphabet;

	private readonly capacity: number;

	public constructor(ring: Alphabet, wired: Alphabet) {
		if (ring.length !== wired.length) {
			throw new Error(
				'Invalid alphabet provided. Please make sure that the ring and wired alphabets have the same length.',
			);
		}

		this.ring = ring;
		this.wired = wired;
		this.capacity = wired.length;
	}

	public getWiringPosition(letter: string): number {
		const index = this.ring.letters.indexOf(letter);

		if (index <= -1) {
			throw new Error(`Could not find letter "${letter}" in the alphabet ${this.ring.letters}`);
		}

		return index;
	}

	public getWiringLetter(position: number): string {
		const letter = this.wired.letters[position];

		if (position > this.size() || position < 0) {
			throw new Error(`Cannot get ring letter for an out of boundary (0-${this.size()}) position "${position}".`);
		}

		return letter;
	}

	/**
	 * Return the ring position of a given letter.
	 */
	public getRingPosition(letter: string): number {
		const index = this.ring.letters.indexOf(letter);

		if (index <= -1) {
			throw new Error(`Could not find letter "${letter}" in the alphabet ${this.ring.letters}`);
		}

		return index;
	}

	/**
	 * Return the letter for the ring alphabet of a given position.
	 */
	public getRingLetter(position: number): string {
		const letter = this.ring.letters[position];

		if (position > this.size() || position < 0) {
			throw new Error(`Cannot get ring letter for an out of boundary (0-${this.size()}) position "${position}".`);
		}

		return letter;
	}

	public size(): number {
		return this.capacity;
	}
}

export { RotorAlphabetWiring };
