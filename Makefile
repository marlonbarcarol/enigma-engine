
.PHONY: \
	build build.prepare \
	code code.fix \
	pretty pretty.check \
	lint lint.check \
	test test.watch \
	clean

default: \
	build

build:
	@ node --version
	@ $(MAKE) clean
	@ echo "👀 Checking code"
	@ $(MAKE) build.prepare -s
	@ echo "👷 Typescript build"
	@ node_modules/.bin/tsc --listEmittedFiles | awk '{print $$2}'
	@ echo "🎉 Build complete 🎉"

build.prepare: code test

# Code standards
code: pretty.check lint.check

code.fix: pretty lint pretty

pretty:
	node_modules/.bin/prettier '.' -w \
	&& $(MAKE) pretty.check

pretty.check:
	node_modules/.bin/prettier '.' -c

lint:
	node_modules/.bin/eslint '.' --fix --format codeframe

lint.check:
	node_modules/.bin/eslint '.' --format codeframe

# Test
test:
	node_modules/.bin/jest --no-cache

test.watch:
	node_modules/.bin/jest --watch

# Cleaning
clean:
	@rm -rf ./build/*
	@rm -rf ./.cache/*
	@rm -rf ./node_modules/.cache/*
	@echo "🧹 Marie Kondo finally found joy. All tidied up."
