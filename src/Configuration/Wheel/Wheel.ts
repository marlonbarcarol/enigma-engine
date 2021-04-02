import { AbstractWiringProcessor } from '@/Configuration/Wiring/AbstractWiringProcessor';
import { Wiring } from '@/Configuration/Wiring/Wiring';

export class Wheel extends AbstractWiringProcessor {
	public constructor(wiring: Wiring) {
		super(wiring);
	}

	public process(letter: string): string {
		return super.process(letter, 0);
	}
}
