# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.6](https://github.com/marlonbarcarol/enigma-engine/compare/v0.0.5...v0.0.6) (2021-06-01)


### Features

* package dependencies updating.

### [0.0.5](https://github.com/marlonbarcarol/enigma-engine/compare/v0.0.4...v0.0.5) (2021-05-16)

### Features

- added factory method for cipher instantiation from JSON, and added more exports ([778040f](https://github.com/marlonbarcarol/enigma-engine/commit/778040ff9a62a2f14771c3cf8d7be5e02bd864e5))
- adding commitlint and husky to enforce it ([8ed96c3](https://github.com/marlonbarcarol/enigma-engine/commit/8ed96c3c05631dc66183f40c52b44e81609206cd))
- adding versioning as well as commitlint make commands. ([ed2b75b](https://github.com/marlonbarcarol/enigma-engine/commit/ed2b75bebd18e676e13701889f345746c61d32b1))

### Bug Fixes

- prettier ([d90ff9b](https://github.com/marlonbarcarol/enigma-engine/commit/d90ff9bd4f0563eeb1d45f6d735fe7176be7db5c))

## [0.0.4] - 2021-05-09

### Fixed

- Updated readme
- Changed to relative paths from typescript absolute paths because otherwise webpack bundling would be necessary.

## [0.0.3] - 2021-05-08

### Fixed

- Build now includes \*.d.ts files
- Also includes a specific build tsconfig.json

## [0.0.2] - 2021-05-08

### Fixed

- NPM versioning

## [0.0.1] - 2021-04-26

### Added

- The ability to encrypt 🗝 and decrypt 🔐 texts
- A nice explanation about the enigma machine as well as an example of usage within README.md
- Support for characters (alphabets) of the users choice 🔠
- Support many rotors as well as the rotor locking mechanism and the ability to specify notches on any position.
- Support plugboard, entry wheels and reflector
- Support whitespace character grouping by a given amount of characters
