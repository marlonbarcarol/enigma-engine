import { Wiring } from '../../main';
import { AbstractWiringProcessor } from '../Wiring/AbstractWiringProcessor';

export class Reflector extends AbstractWiringProcessor {
	public pointer: number;

	public constructor(wiring: Wiring, pointer = 0) {
		super(wiring);

		this.pointer = pointer;
	}

	public process(letter: string): string {
		return super.process(letter, this.pointer ?? 0);
	}

	public rotate(): void {
		this.pointer++;
	}
}
