import { Nullable } from '../../types/type';
import { AbstractWiringProcessor, WiringProcessOrderEnum } from '../Wiring/AbstractWiringProcessor';
import { RotorRing } from './RotorRing';
import { RotorWiring, RotorWiringDirectionEnum } from './RotorWiring';

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

export interface RotorConfiguration {
	wiring: RotorWiring; // Required.
	position?: string; // Defaults to the first character of the input.
	notches?: string[]; // Defaults to no notches when not provided.
	ring?: RotorRing; // Defaults to the first character of the input.
	lock?: boolean; // Defaults to false, when true prevents wheel rotation.
}

export interface RotorTraceHit {
	rotor: Rotor;
	input: string;
	output: string;
}

export class Rotor extends AbstractWiringProcessor {
	public wiring: RotorWiring;
	public pointer: number;
	public readonly notches: string[];
	public readonly ring: RotorRing;
	public connection: RotorConnection;
	public readonly locked: boolean;

	public constructor(configuration: RotorConfiguration) {
		super(configuration.wiring);

		this.wiring = configuration.wiring;
		this.notches = configuration.notches ?? [];
		this.pointer = this.wiring.input.positionOf(configuration.position ?? this.wiring.input.at(0));
		this.ring = configuration.ring ?? new RotorRing(0);
		this.locked = configuration.lock ?? false;
		this.connection = {
			previous: null,
			next: null,
		};
	}

	/**
	 * The rotors are linked to between each other.
	 */
	public connect(previous: Nullable<Rotor>, next: Nullable<Rotor>): void {
		// Internally reverts the order
		this.connection = { previous: next, next: previous };
	}

	/**
	 * Rotate rotor connections while processing.
	 */
	public rotateConnection(): void {
		if (this.connection.next === null) {
			return;
		}

		let position: number;
		let char: string;

		position = this.cap(this.connection.next.pointer);
		char = this.wiring.input.at(position);

		// Catering for double stepping.
		if (this.connection.next.notches.includes(char) === true) {
			this.connection.next.rotate();

			return;
		}

		position = this.cap(this.pointer);
		char = this.wiring.input.at(position);

		if (this.notches.includes(char) === true) {
			this.connection.next.rotate();
		}
	}

	/**
	 * 🎡 Rotate
	 */
	public rotate(): void {
		if (this.locked === true) {
			throw new Error(`Rotor should not rotate when lock mechanism is activated.`);
		}

		this.rotateConnection();

		this.pointer++;
	}

	/**
	 * Whether it should rotate during processing.
	 */
	public shouldRotate(): boolean {
		// When circuit goes back from it should never rotate
		if (this.order === WiringProcessOrderEnum.OUTPUT_INPUT) {
			return false;
		}

		// When the wheel is locked it does not rotates.
		if (this.locked === true) {
			return false;
		}

		// First rotor always rotate
		if (this.connection.previous === null) {
			return true;
		}

		return false;
	}

	/**
	 * The core of a rotor is processing a letter.
	 */
	public process(letter: string): string {
		return this.processWithTrace(letter);
	}

	/**
	 * Same substitution/rotation logic as `process()`. Kept as a separate
	 * method (rather than a second parameter on `process()`) because
	 * `process()` overrides `AbstractWiringProcessor.process(letter, pointer:
	 * number)`, and a second parameter there must stay assignable to
	 * `number` -- it can't be repurposed for trace collection.
	 *
	 * `trace`, when provided, receives one entry per rotor visited during this
	 * call's traversal (including rotors visited recursively via `connection`),
	 * in the order they were actually processed.
	 */
	public processWithTrace(letter: string, trace?: RotorTraceHit[]): string {
		if (this.shouldRotate()) {
			this.rotate();
		}

		const char = super.process(letter, this.pointer);

		trace?.push({ rotor: this, input: letter, output: char });

		if (this.order === WiringProcessOrderEnum.INPUT_OUTPUT) {
			if (this.connection.next !== null) {
				return this.connection.next.processWithTrace(char, trace);
			}

			return char;
		}

		if (this.order === WiringProcessOrderEnum.OUTPUT_INPUT) {
			if (this.connection.previous !== null) {
				return this.connection.previous.processWithTrace(char, trace);
			}

			return char;
		}

		throw new Error(`Could not process unsupported wiring order ${this.order as string}.`);
	}

	public cap(pointer?: number): number {
		return super.cap(pointer ?? this.pointer);
	}

	public flipOrder(): void {
		super.flipOrder();

		// Rearranging rotor ordering
		this.connection = {
			previous: this.connection.previous,
			next: this.connection.next,
		};
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

		const history: RotorHistory = {
			wiring: {
				shifts: wiringShifts,
				rotations: wiringRotations,
			},
		};

		return history;
	}
}
