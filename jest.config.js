/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	cacheDirectory: '<rootDir>/.cache/jest',
	modulePathIgnorePatterns: ['<rootDir>/build', '<rootDir>/node_modules'],
};
