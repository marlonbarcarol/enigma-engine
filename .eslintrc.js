/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
const { Linter } = require('eslint');

/** @type Linter.Config */
module.exports = {
	'root': true,
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking'
	],
	'rules': {
		// code style
		'key-spacing': ['error', { 'afterColon': true }],
		'quote-props': ['error', 'always'],
		'no-else-return': ['error'],
		'no-multiple-empty-lines': [
			'error',
			{
				'max': 2,
				'maxBOF': 0,
				'maxEOF': 1
			}
		],
		'space-in-parens': ['error', 'never'],
		'spaced-comment': ['error', 'always'],
		'switch-colon-spacing': ['error'],
		'object-property-newline': ['error', { 'allowAllPropertiesOnSameLine': false }],
		'object-curly-newline': [
			'error',
			{
				'ObjectExpression': {
					'consistent': true,
					'multiline': true,
					'minProperties': 2
				},
				'ObjectPattern': {
					'consistent': true,
					'multiline': true,
					'minProperties': 2
				},
				'ImportDeclaration': {
					'consistent': true,
					'multiline': true,
					'minProperties': 2
				},
				'ExportDeclaration': {
					'consistent': true,
					'multiline': true,
					'minProperties': 2
				}
			}
		],

		'comma-dangle': 'off',
		'@typescript-eslint/comma-dangle': ['error'],

		'object-curly-spacing': 'off',
		'@typescript-eslint/object-curly-spacing': ['error', 'always'],

		'quotes': 'off',
		'@typescript-eslint/quotes': ['error', 'single', { 'avoidEscape': true }],

		'space-before-function-paren': 'off',
		'@typescript-eslint/space-before-function-paren': [
			'error',
			{
				'anonymous': 'never',
				'named': 'never',
				'asyncArrow': 'never'
			}
		],

		'semi': 'off',
		'@typescript-eslint/semi': ['error'],

		// code analysis
		'no-unused-vars': ['off'],
		'@typescript-eslint/no-unused-vars': ['error'],

		'no-throw-literal': 'off',
		'@typescript-eslint/no-throw-literal': ['error'],

		'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
		'@typescript-eslint/explicit-module-boundary-types': ['warn'],
		'@typescript-eslint/no-explicit-any': ['error'],
		'@typescript-eslint/no-non-null-assertion': ['error'],

		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
	},
	'plugins': ['@typescript-eslint'],
	'env': {
		'es6': true,
		'node': true
	},
	'ignorePatterns': ['node_modules', 'build'],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'tsconfigRootDir': __dirname,
		'project': ['./tsconfig.eslint.json'],
		'sourceType': 'module'
	}
};
