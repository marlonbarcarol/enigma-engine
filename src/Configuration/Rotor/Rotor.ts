import { RotorRing } from '@/Configuration/Rotor/RotorRing';
import { RotorWiring } from '@/Configuration/Rotor/RotorWiring';
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

export class Rotor {
	public wiring: RotorWiring;
	public readonly ring: RotorRing;
	public readonly notches: number[];
	public pointer: number;
	public readonly maxRotation: number;
	private connection: RotorConnection;
	private configured: boolean;

	public constructor(ring: RotorRing, wiring: RotorWiring, position: number) {
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
	 * The rotors are linked to this rotor.
	 */
	public connect(previous: Nullable<Rotor>, next: Nullable<Rotor>): void {
		this.connection = { previous, next };
	}

	public turnover(): void {
		this.pointer++;

		if (this.notches.includes(this.pointer) === true) {
			this.connection.next?.turnover();
		}
	}

	public process(letter: string): string {
		if (this.configured === false) {
			throw new Error('Rotor is not configured. Please first configure the rotor before processing.');
		}

		this.turnover();

		let position: number = this.wiring.input.positionOf(letter);
		position = position + this.pointer;

		const char = this.wiring.getMappedCharAt(position);

		return char;
	}

	public isFirstRotation(): boolean {
		return this.pointer % this.maxRotation === 0;
	}

	/**
	 * Configure the ring settings and wirings.
	 */
	public configureWiring(): RotorHistory {
		const wiringShifts: RotorWiring[] = [];
		const wiringRotations: RotorWiring[] = [];

		wiringShifts.push(this.wiring);

		for (let i = 0; i < this.ring.setting; i++) {
			let wiring = wiringShifts[wiringShifts.length - 1];
			wiring = wiring.shift();

			wiringShifts.push(wiring);
		}

		wiringRotations.push(wiringShifts[wiringShifts.length - 1]);

		for (let i = 0; i < this.ring.setting; i++) {
			let wiring = wiringRotations[wiringRotations.length - 1];
			wiring = wiring.rotate();

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
