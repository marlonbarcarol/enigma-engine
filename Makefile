
.PHONY: \
	ci \
	compile \
	version.bump version.bump.preview \
	changelog changelog.preview \
	commitlint.main \
	build build.ts build.exo \
	clean \
	checkup \
	code code.fix code.check \
	pretty pretty.check \
	lint lint.check \
	type.check \
	test test.watch \
	npm.publish npm.publish.dry-run \

default: ci

# 🎉 Compile stuffs

ci:
	node --version
	npm --version
	npm ci --ignore-scripts
	npm ls
	$(MAKE) compile

compile:
	@ echo "🩺 Checking code"
	$(MAKE) checkup
	@ echo "👷 Building"
	$(MAKE) build
	@ echo "🌲 Build tree"
	tree -s -h --du build
	@ echo "🎉 Compile complete 🎉"

# ⬆️ Add changes to changelog

version.bump:
	npx standard-version

version.bump.preview:
	npx standard-version --dry-run

changelog:
	npx standard-version --skip.commit --skip.tag

changelog.preview:
	npx standard-version --skip.commit --skip.tag --dry-run

# 🧐 Lint commits from current branch against main

commitlint.main:
	npx commitlint --verbose --from "origin/main"

# 👷 Build

build: clean build.ts build.exo

build.ts:
	node_modules/.bin/tsc --build tsconfig.build.json --listEmittedFiles

build.exo:
	cp -v package.json ./build
	cp -v ./*.md ./build
	rsync --verbose --relative ./src/./**/*.d.ts ./build

# 🧹 Cleaning

clean:
	rm -rf ./build/*
	rm -rf ./.cache/*
	rm -rf ./node_modules/.cache/*
	@ echo "🧹 Marie Kondo finally found joy. All tidied up."

# 🕵️‍♂️ Code standards

checkup: code.check test

code.check: pretty.check lint.check type.check

code.fix: pretty lint type.check

pretty:
	node_modules/.bin/prettier --write --list-different '.'
	$(MAKE) pretty.check -s

pretty.check:
	node_modules/.bin/prettier --check '.'

lint:
	node_modules/.bin/eslint --fix --format codeframe '.'

lint.check:
	node_modules/.bin/eslint --format codeframe '.'

type.check:
	node_modules/.bin/tsc --noEmit -p .

# 🚦 Test

test:
	node_modules/.bin/jest --no-cache --verbose

test.watch:
	node_modules/.bin/jest --watch --verbose

# 🗞 NPM

# Recommended to run: make changelog.preview npm.publish.preview
npm.publish.preview:
	$(MAKE) compile
	npm publish './build' --access public --tag beta --dry-run

# Recommended to
# - make changelog
# - check changelog is good to go
# - git commit -am 'chore: bumping version' && git push -u
# - make npm.publish
npm.publish:
	$(MAKE) compile
	npm publish './build' --access public
