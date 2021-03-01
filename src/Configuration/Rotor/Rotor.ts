import { Alphabet } from '@/Configuration/Alphabet/Alphabet';
import { RotorRing } from '@/Configuration/Rotor/RotorRing';
import { RotorWiring } from '@/Configuration/Rotor/RotorWiring';

export class Rotor {
	public readonly wiring: RotorWiring;
	public readonly ring: RotorRing;
	public readonly capacity: number;
	public readonly notches: number[];
	public pointer: number;
	public connection?: Rotor;

	public constructor(
		ring: RotorRing,
		wiring: RotorWiring,
		position: string
	) {
		this.ring = ring;
		this.wiring = wiring;
		this.capacity = wiring.size();
		this.pointer = this.wiring.getInputPosition(position);
		this.notches = [this.pointer];
	}

	public connect(rotor?: Rotor): void {
		this.connection = rotor;
	}

	public process(letter: string): string {
		const wiringShifts: RotorWiring[] = [];
		const wiringRotations: RotorWiring[] = [];

		wiringShifts.push(this.wiring);

		for (let i = 0; i < this.ring.setting; i++) {
			let wiring = wiringShifts[wiringShifts.length - 1];
			wiring = wiring.shift();

			wiringShifts.push(wiring);
		}

		for (let i = 0; i < this.ring.setting; i++) {
			let wiring = wiringRotations[wiringShifts.length - 1];
			wiring = wiring.rotate();

			wiringRotations.push(wiring);
		}

		const ringSetting: number = this.wiring.getOutputLetter(this.ring.setting);


		let startMarking: number = this.wiring.getStartMarkingPosition();

		//// ----
		let wiring = this.wiring.getOutputLetter(startMarking);

		for(const wiringLetter of wiring) {

		}





		//// ----
		let position = this.wiring.getOutputPosition(letter);
		// The letter position is shifted according to rotor's position.
		position = position + this.pointer + 1;

		// When it is in the last position
		if (position === this.capacity) {
			return this.wiring.getOutputLetter(position);
		}

		position = position % this.capacity;

		return this.wiring.getOutputLetter(position);
	}

	public isBeginning(): boolean {
		return (this.pointer + 1) % this.capacity === 0;
	}
}

