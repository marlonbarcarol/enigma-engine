import { AbstractWiringProcessor } from '@/Configuration/Wiring/AbstractWiringProcessor';
import { Wiring } from '@/Configuration/Wiring/Wiring';

export class Plugboard extends AbstractWiringProcessor {
	public constructor(wiring: Wiring) {
		super(wiring);
	}
}
