/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier',
		'prettier/@typescript-eslint',
	],
	rules: {
		// Code analysis
		'no-unused-vars': ['off'],
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				args: 'none',
				ignoreRestSiblings: true,
			},
		],

		'no-throw-literal': 'off',
		'@typescript-eslint/no-throw-literal': ['error'],

		'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
		'@typescript-eslint/explicit-module-boundary-types': ['warn'],
		'@typescript-eslint/no-explicit-any': ['error'],
		'@typescript-eslint/no-non-null-assertion': ['error'],

		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

		// Code style
		'no-else-return': ['error'],
		'spaced-comment': ['error', 'always'],
	},
	plugins: ['@typescript-eslint'],
	env: {
		es6: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.json'],
		sourceType: 'module',
	},
	ignorePatterns: ['build', 'node_modules'],
};
