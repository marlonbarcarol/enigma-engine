import { Environment, EnvironmentEnum } from '@/Common/Environment';
import { Static } from '@/Common/Static';

if (process.env['NODE_ENV'] === null || process.env['NODE_ENV'] === undefined) {
	throw new Error('Cannot initialized the application without the environment variable set ``');
}

export class Logger extends Static {
	public static info(message: string): void {
		if (Environment.isEnvironment(EnvironmentEnum.PRODUCTION)) {
			return;
		}

		if (Environment.isEnvironment(EnvironmentEnum.TEST)) {
			return;
		}

		console.info(message);
	}
}
