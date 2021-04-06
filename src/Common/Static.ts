export class Static {
	constructor(...args: unknown[]) {
		throw new Error(`Cannot instantiate a static class. "${arguments.callee.name}"`);
	}
}
