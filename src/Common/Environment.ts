import { Static } from '@/Common/Static';

export enum EnvironmentEnum {
	PRODUCTION = 'production',
	DEVELOPMENT = 'development',
	TEST = 'test',
}

export class Environment extends Static {
	public static env: NodeJS.ProcessEnv = process.env;

	public static get(key: string): string {
		const variable = this.env[key];

		if (variable === undefined) {
			throw Error(`Environment variable "${key}" is not defined.`);
		}

		return variable;
	}

	public static isEnvironment(environment: EnvironmentEnum): boolean {
		return this.get('NODE_ENV') === environment;
	}
}
