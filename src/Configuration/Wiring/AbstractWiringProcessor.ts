import { Wiring } from '@/Configuration/Wiring/Wiring';

export abstract class AbstractWiringProcessor {
	public wiring: Wiring;

	protected constructor(wiring: Wiring) {
		this.wiring = wiring;
	}

	public process(letter: string, pointer: number): string {
		let position: number = this.wiring.input.positionOf(letter);
		position = (position + pointer) % this.wiring.quantity;

		let char = this.wiring.getInputMappedCharAt(position);

		position = this.wiring.input.positionOf(char) - (pointer % this.wiring.quantity);

		if (position < 0) {
			position = this.wiring.quantity - Math.abs(position);
		}

		char = this.wiring.input.at(position);

		return char;
	}
}
