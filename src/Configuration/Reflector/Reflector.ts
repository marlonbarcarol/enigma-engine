import { AbstractWiringProcessor } from '@/Configuration/Wiring/AbstractWiringProcessor';
import { Wiring } from '@/Configuration/Wiring/Wiring';

export class Reflector extends AbstractWiringProcessor {
	public pointer?: number;

	public constructor(wiring: Wiring, pointer?: number) {
		super(wiring);

		this.pointer = pointer;
	}

	public process(letter: string): string {
		return super.process(letter, this.pointer ?? 0);
	}
}
