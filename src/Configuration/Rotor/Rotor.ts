import { RotorRing } from '@/Configuration/Rotor/RotorRing';
import { RotorWiring, RotorWiringDirectionEnum } from '@/Configuration/Rotor/RotorWiring';
import { AbstractWiringProcessor, WiringProcessOrderEnum } from '@/Configuration/Wiring/AbstractWiringProcessor';
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
	public readonly notches: string[];
	public pointer: number;
	public readonly maxRotation: number;
	private connection: RotorConnection;
	private configured: boolean;

	public constructor(ring: RotorRing, wiring: RotorWiring, position: number, notches: string[] = []) {
		super(wiring);

		this.ring = ring;
		this.wiring = wiring;
		this.maxRotation = this.max;
		this.notches = notches;
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

	public connectionRotate(): void {
		if (this.connection.previous === null) {
			return;
		}

		let position: number;
		let char: string;

		if (this.connection.previous.connection.previous !== null) {
			position = this.cap(this.connection.previous.pointer);
			char = this.wiring.input.at(position);

			// fuckin double step
			if (this.connection.previous.notches.includes(char) === true) {
				this.connection.previous.connection.previous.pointer++;
				this.connection.previous.pointer++;
			}
		}

		position = this.cap(this.pointer);
		char = this.wiring.input.at(position);

		if (this.notches.includes(char) === true) {
			this.connection.previous.pointer++;
		}
	}

	public rotate(): void {
		this.connectionRotate();

		this.pointer++;
	}

	public shouldRotate(): boolean {
		if (this.order === WiringProcessOrderEnum.OUTPUT_INPUT) {
			return false;
		}

		if (this.connection.next === null) {
			return true;
		}

		return false;
	}

	public process(letter: string): string {
		if (this.configured === false) {
			this.configured = false;
		}

		if (this.shouldRotate()) {
			this.rotate();
		}

		const char = super.process(letter, this.pointer);

		if (this.order === WiringProcessOrderEnum.INPUT_OUTPUT) {
			if (this.connection.previous !== null) {
				return this.connection.previous.process(char);
			}

			return char;
		}

		if (this.order === WiringProcessOrderEnum.OUTPUT_INPUT) {
			if (this.connection.next !== null) {
				return this.connection.next.process(char);
			}

			return char;
		}

		throw new Error(`Could not process unsupported wiring order ${this.order as string}.`);
	}

	public cap(pointer?: number): number {
		return super.cap(pointer ?? this.pointer);
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
