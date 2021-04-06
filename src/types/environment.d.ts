import { EnvironmentEnum } from '@/Common/Environment';

declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: EnvironmentEnum;
	}
}
