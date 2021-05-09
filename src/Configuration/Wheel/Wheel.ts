import { Wiring } from '../../main';
import { AbstractWiringProcessor } from '../Wiring/AbstractWiringProcessor';

export class Wheel extends AbstractWiringProcessor {
	public constructor(wiring: Wiring) {
		super(wiring);
	}

	public process(letter: string): string {
		return super.process(letter, 0);
	}
}
