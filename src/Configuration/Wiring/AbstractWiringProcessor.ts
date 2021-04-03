import { Wiring } from '@/Configuration/Wiring/Wiring';

export enum WiringProcessOrderEnum {
	INPUT_OUTPUT = 'IO',
	OUTPUT_INPUT = 'OI',
}

export abstract class AbstractWiringProcessor {
	public readonly wiring: Wiring;
	public order: WiringProcessOrderEnum;

	protected constructor(wiring: Wiring) {
		this.wiring = wiring;
		this.order = WiringProcessOrderEnum.INPUT_OUTPUT;
	}

	public process(letter: string, pointer: number): string {
		let position: number = this.wiring.input.positionOf(letter);
		position = (position + pointer) % this.wiring.quantity;

		let char: string;

		switch (this.order) {
			case WiringProcessOrderEnum.INPUT_OUTPUT:
				char = this.wiring.getInputMappedCharAt(position);
				break;

			case WiringProcessOrderEnum.OUTPUT_INPUT:
				char = this.wiring.getOutputMappedCharAt(position);
				break;

			default:
				throw new Error(`Cannot process unsupported wiring order "${this.order as string}".`);
		}

		position = this.wiring.input.positionOf(char) - (pointer % this.wiring.quantity);

		if (position < 0) {
			position = this.wiring.quantity - Math.abs(position);
		}

		char = this.wiring.input.at(position);

		return char;
	}

	/**
	 * Inverts the wiring circuit order.
	 */
	public flipOrder(): void {
		if (this.order === WiringProcessOrderEnum.INPUT_OUTPUT) {
			this.order = WiringProcessOrderEnum.OUTPUT_INPUT;

			return;
		}

		if (this.order === WiringProcessOrderEnum.OUTPUT_INPUT) {
			this.order = WiringProcessOrderEnum.INPUT_OUTPUT;

			return;
		}

		throw new Error(`Cannot flip unsuported wiring order "${this.order as string}".`);
	}
}
