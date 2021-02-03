
.PHONY: code code.fix pretty pretty.check lint lint.check

default: \
	code.fix
	node_modules/.bin/tsc --noEmit ./src/**

# -- Code standards
code: pretty.check lint.check

code.fix: pretty lint pretty

pretty:
	node_modules/.bin/prettier '.' -w
	$(MAKE) pretty.check

pretty.check:
	node_modules/.bin/prettier '.' -c

lint:
	node_modules/.bin/eslint '.' --fix --format codeframe

lint.check:
	node_modules/.bin/eslint '.' --format codeframe

# -- Test
test:
	node_modules/.bin/jest --no-cache

test.watch:
	node_modules/.bin/jest --watch
