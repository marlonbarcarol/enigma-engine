import { RotorRing } from '@/Configuration/Rotor/RotorRing';
import { RotorWiring, RotorWiringDirectionEnum } from '@/Configuration/Rotor/RotorWiring';
import { AbstractWiringProcessor } from '@/Configuration/Wiring/AbstractWiringProcessor';
import { Nullable } from '@/types/type';

export interface RotorHistory {
	wiring: {
		shifts: RotorWiring[];
		rotations: RotorWiring[];
	};
}

export interface RotorConnection {
	previous: Nullable<Rotor>;
	next: Nullable<Rotor>;
}

export class Rotor extends AbstractWiringProcessor {
	public wiring: RotorWiring;
	public readonly ring: RotorRing;
	public readonly notches: number[];
	public pointer: number;
	public readonly maxRotation: number;
	private connection: RotorConnection;
	private configured: boolean;

	public constructor(ring: RotorRing, wiring: RotorWiring, position: number) {
		super(wiring);

		this.ring = ring;
		this.wiring = wiring;
		this.maxRotation = wiring.size();
		this.notches = [position];
		this.pointer = position;
		this.connection = {
			previous: null,
			next: null,
		};
		this.configured = false;
	}

	/**
	 * The rotors are linked to between each other.
	 */
	public connect(previous: Nullable<Rotor>, next: Nullable<Rotor>): void {
		this.connection = { previous, next };
	}

	public rotate(): void {
		this.pointer++;

		const position = this.pointer % this.wiring.size();

		if (this.notches.includes(position) === true) {
			// this.connection.next?.rotate();
		}
	}

	public process(letter: string): string {
		if (this.configured === false) {
			throw new Error('Rotor is not configured. Please first configure the rotor ring wiring before processing.');
		}

		const char = super.process(letter, this.pointer);

		if (this.connection.next !== null) {
			// return this.connection.next.process(char);
		}

		return char;
	}

	/**
	 * Configure the ring settings and wirings.
	 */
	public configureRingWiring(): RotorHistory {
		const wiringShifts: RotorWiring[] = [];
		const wiringRotations: RotorWiring[] = [];

		wiringShifts.push(this.wiring);

		for (let i = 0; i < this.ring.setting; i++) {
			let wiring = wiringShifts[wiringShifts.length - 1];
			wiring = wiring.shiftUp();

			wiringShifts.push(wiring);
		}

		wiringRotations.push(wiringShifts[wiringShifts.length - 1]);

		for (let i = 0; i < this.ring.setting; i++) {
			let wiring = wiringRotations[wiringRotations.length - 1];
			wiring = wiring.rotateOutput(RotorWiringDirectionEnum.BACKWARD);

			wiringRotations.push(wiring);
		}

		this.wiring = wiringRotations[wiringRotations.length - 1];
		this.configured = true;

		const history: RotorHistory = {
			wiring: {
				shifts: wiringShifts,
				rotations: wiringRotations,
			},
		};

		return history;
	}
}
