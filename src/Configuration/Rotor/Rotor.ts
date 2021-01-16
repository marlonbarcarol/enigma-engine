import { RotorAlphabetWiring } from "@/Configuration/Rotor/RotorAlphabetWiring";

class Rotor implements IterableIterator<Rotor> {
  public readonly rotorAlphabetWiring: RotorAlphabetWiring;
  public readonly startingPosition: string;
  public readonly capacity: number;
  public pointer: number;

  public constructor(
    rotorAlphabetWiring: RotorAlphabetWiring,
    startingPosition: string
  ) {
    this.rotorAlphabetWiring = rotorAlphabetWiring;
    this.startingPosition = startingPosition;
    this.capacity = rotorAlphabetWiring.size();
    this.pointer = this.rotorAlphabetWiring.getRingPosition(startingPosition);
  }

  public next(): IteratorResult<this> {
    // const position = (this.pointer + 1) % this.capacity;
    // const letter = this.rotorAlphabetWiring.getRingLetter(position);

    ++this.pointer;

    return {
      value: this,
      done: false, // Endless 🔁 rotation 🤷‍♂️
    };
  }

  public rewind(): void {
    this.pointer = 0;
  }

  public process(letter: string): string {
    let position = this.rotorAlphabetWiring.getWiringPosition(letter);
    // The letter position is shifted according to rotor's position.
    position = (position + this.pointer + 1);

    // When it is in the last position
    if (position === this.capacity) {
      return this.rotorAlphabetWiring.getWiringLetter(position);
    }

    position = position % this.capacity;

    return this.rotorAlphabetWiring.getWiringLetter(position);
  }

  public isBeginning(): boolean {
    return ((this.pointer + 1) % this.capacity) === 0;
  }

  [Symbol.iterator](): IterableIterator<this> {
    return this;
  }
}

export { 
  Rotor,
};