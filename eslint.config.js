/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment */

const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettierConfig = require('eslint-config-prettier');
const globals = require('globals');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
	{
		ignores: ['build/**', 'demo/**'],
	},
	js.configs.recommended,
	...tseslint.configs['flat/recommended'],
	...tseslint.configs['flat/recommended-type-checked'],
	prettierConfig,
	{
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				tsconfigRootDir: __dirname,
				projectService: {
					allowDefaultProject: ['*.js'],
				},
			},
			globals: {
				...globals.node,
				...globals.es2015,
			},
		},
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
			'@typescript-eslint/only-throw-error': ['error'],

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
	},
];
