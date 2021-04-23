import { Alphabet } from '@/Configuration/Alphabet/Alphabet';
import { Wiring } from '@/Configuration/Wiring/Wiring';

export enum RotorWiringDirectionEnum {
	FORWARD = 0,
	BACKWARD = 1,
}

// A rotor contains an alphabet (input) wired to a shuffled alphabet (output).
export class RotorWiring extends Wiring {
	public constructor(input: Alphabet, output: Alphabet) {
		super(input, output);
	}

	public static create(input: Alphabet, output: Alphabet): RotorWiring {
		return new this(input, output);
	}

	public static withEnglish(output: Alphabet): RotorWiring {
		return new this(Alphabet.createEnglish(), output);
	}

	/**
	 * Creates a new wiring keeping current input.
	 */
	public withInput(input: Alphabet): RotorWiring {
		return new RotorWiring(input, this.output);
	}

	/**
	 * Creates a new wiring keeping current output.
	 */
	public withOutput(output: Alphabet): RotorWiring {
		return new RotorWiring(this.input, output);
	}

	/**
	 * Moves the wiring output letters up.
	 */
	public shiftUp(): RotorWiring {
		let output = '';

		for (const letter of this.output.characters) {
			let position: number = this.input.positionOf(letter);
			position = (position + 1) % this.size();

			const newLetter: string = this.input.at(position);

			output = output.concat(newLetter);
		}

		const alphabet = new Alphabet(output);
		const rotorWiring = this.withOutput(alphabet);

		return rotorWiring;
	}

	/**
	 * Moves the wiring letters sideways as a looping queue.
	 */
	public rotateInput(direction: RotorWiringDirectionEnum): RotorWiring {
		let newWiring = '';

		switch (direction) {
			case RotorWiringDirectionEnum.FORWARD:
				newWiring = newWiring.concat(this.input.characters.slice(1, Infinity));
				newWiring = newWiring.concat(this.input.characters.slice(0, 1));
				break;

			case RotorWiringDirectionEnum.BACKWARD:
				newWiring = newWiring.concat(this.input.characters.slice(-1));
				newWiring = newWiring.concat(this.input.characters.slice(0, -1));
				break;

			default:
				throw new Error(`Invalid input rotation direction ${direction as string}.`);
		}

		const alphabet = new Alphabet(newWiring);
		const rotorWiring = this.withInput(alphabet);

		return rotorWiring;
	}

	/**
	 * Moves the wiring letters sideways as a looping queue.
	 */
	public rotateOutput(direction: RotorWiringDirectionEnum): RotorWiring {
		let newWiring = '';

		switch (direction) {
			case RotorWiringDirectionEnum.FORWARD:
				newWiring = newWiring.concat(this.output.characters.slice(1, Infinity));
				newWiring = newWiring.concat(this.output.characters.slice(0, 1));
				break;

			case RotorWiringDirectionEnum.BACKWARD:
				newWiring = newWiring.concat(this.output.characters.slice(-1));
				newWiring = newWiring.concat(this.output.characters.slice(0, -1));
				break;

			default:
				throw new Error(`Invalid output rotation direction ${direction as string}.`);
		}

		const alphabet = new Alphabet(newWiring);
		const rotorWiring = this.withOutput(alphabet);

		return rotorWiring;
	}

	public size(): number {
		return this.quantity;
	}
}
