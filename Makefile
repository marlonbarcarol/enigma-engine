
.PHONY: \
	compile \
	build.pre build \
	clean \
	code code.fix code.check \
	pretty pretty.check \
	lint lint.check \
	type.check \
	test test.watch \
	npm.publish npm.publish.dry-run \

default: compile

# 🎉 Compile stuffs

ci:
	node --version
	npm --version
	npm ls
	npm ci
	$(MAKE) compile

compile:
	@ $(MAKE) clean
	@ echo "👀 Checking code"
	@ $(MAKE) build.pre
	@ echo "👷 Typescript build"
	@ $(MAKE) build
	@ echo "🎉 Compile complete 🎉"

# 👷 Build

build:
	node_modules/.bin/tsc --build tsconfig.build.json --listEmittedFiles

build.pre:
	$(MAKE) code.check
	$(MAKE) type.check
	$(MAKE) test
	cp package.json ./build
	cp ./*.md ./build
	rsync --relative ./src/./**/*.d.ts ./build --verbose


# 🧹 Cleaning
clean:
	rm -rf ./build/*
	rm -rf ./.cache/*
	rm -rf ./node_modules/.cache/*
	echo "🧹 Marie Kondo finally found joy. All tidied up."

# 🕵️‍♂️ Code standards
code.check: pretty.check lint.check type.check

code.fix: pretty lint type.check

pretty:
	node_modules/.bin/prettier '.' -w
	$(MAKE) pretty.check

pretty.check:
	node_modules/.bin/prettier '.' -c

lint:
	node_modules/.bin/eslint '.' --fix --format codeframe

lint.check:
	node_modules/.bin/eslint '.' --format codeframe

type.check:
	node_modules/.bin/tsc --noEmit -p .

# 🚦 Test
test:
	node_modules/.bin/jest --no-cache --verbose

test.watch:
	node_modules/.bin/jest --watch --verbose

# 🗞 NPM
npm.publish.dry-run:
	$(MAKE) compile
	npm publish './build' --access public --tag beta --dry-run

npm.publish:
	$(MAKE) compile
	npm publish './build' --access public --tag beta
