/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	cacheDirectory: '<rootDir>/.cache/jest',
	modulePathIgnorePatterns: ['<rootDir>/build', '<rootDir>/node_modules'],
};
