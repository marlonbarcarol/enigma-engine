
.PHONY: code code.fix

default: \
	code.fix
	node_modules/.bin/tsc --noEmit ./src/**

code:
	node_modules/.bin/eslint --cache --format codeframe ./

code.fix:
	node_modules/.bin/eslint --fix --format codeframe ./
