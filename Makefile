
.PHONY: \
	compile \
	build build.prepare \
	clean \
	code code.fix \
	pretty pretty.check \
	lint lint.check \
	type.check \
	test test.watch \

default: compile

# 🎉 Compile stuffs

compile:
	@ node --version
	@ $(MAKE) clean
	@ echo "👀 Checking code"
	@ $(MAKE) build.prepare
	@ echo "👷 Typescript build"
	@ $(MAKE) build
	@ echo "🎉 Compile complete 🎉"

# 👷 Build

build:
	node_modules/.bin/tsc --listEmittedFiles | awk '{print $$2}'

build.prepare: code.check test type.check

# 🧹 Cleaning
clean:
	rm -rf ./build/*
	rm -rf ./.cache/*
	rm -rf ./node_modules/.cache/*
	echo "🧹 Marie Kondo finally found joy. All tidied up."

# 🕵️‍♂️ Code standards
code.check: pretty.check lint.check type.check

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

type.check:
	node_modules/.bin/tsc --noEmit

# 🚦 Test
test:
	node_modules/.bin/jest --no-cache --verbose

test.watch:
	node_modules/.bin/jest --watch --verbose
