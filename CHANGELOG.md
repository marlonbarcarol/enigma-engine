# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.2](https://github.com/marlonbarcarol/enigma-engine/compare/v0.1.1...v0.1.2) (2026-09-04)


### Features

* add Cipher.encryptWithTrace() for per-character signal-path tracing ([4b74e5a](https://github.com/marlonbarcarol/enigma-engine/commit/4b74e5a69783a30b73d84b3ef1ec74d035dcb9fe))

### [0.1.1](https://github.com/marlonbarcarol/enigma-engine/compare/v0.1.0...v0.1.1) (2026-09-04)


### Bug Fixes

* run rotor ring-wiring setup once per instance, not per encrypt() call ([36650f3](https://github.com/marlonbarcarol/enigma-engine/commit/36650f32b53fca887e814c1812182452434ddc9f))

## [0.1.0](https://github.com/marlonbarcarol/enigma-engine/compare/v0.0.8...v0.1.0) (2026-09-03)


### ⚠ BREAKING CHANGES

* CipherJSON is now CipherOptions, and Cipher.fromJSON
is now Cipher.create. Update imports and call sites accordingly:

  import { Cipher, CipherOptions } from '@enigmaciphy/engine';
  const cipher = Cipher.create(options);

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VAaLNZr6D5dmVW8WBFjr2M

### Features

* expose rotor ring settings and reflector position via CipherJSON ([506d51b](https://github.com/marlonbarcarol/enigma-engine/commit/506d51b9dc8ab25908a68510a304bd882342c320))


### Bug Fixes

* escape special regex characters in alphabet sanitizer ([a5b2ec7](https://github.com/marlonbarcarol/enigma-engine/commit/a5b2ec78294ce410add7eac479a2266421cc850f))


* rename CipherJSON/fromJSON to CipherOptions/create ([a527f74](https://github.com/marlonbarcarol/enigma-engine/commit/a527f74e10029ac22926e65189fc97f912a7a06c))

### [0.0.8](https://github.com/marlonbarcarol/enigma-engine/compare/v0.0.5...v0.0.8) (2022-01-11)

* updating vulnerable dependencies

### Features

* added factory method for cipher instantiation from JSON, and added more exports ([633e494](https://github.com/marlonbarcarol/enigma-engine/commit/633e494b374b9ad130ff4c85b0fd59b9e8b92c75))
* adding commitlint and husky to enforce it ([4d02510](https://github.com/marlonbarcarol/enigma-engine/commit/4d025102bdc80fe8690609c5c224b4faf6f235f5))
* adding versioning as well as commitlint make commands. ([818acef](https://github.com/marlonbarcarol/enigma-engine/commit/818acefcbc13e03da890dd7c9a63e74cd25e9c27))

### [0.0.7](https://github.com/marlonbarcarol/enigma-engine/compare/v0.0.5...v0.0.7) (2022-01-10)

* updating dependencies
  * [bump typescript from 4.3.2 to 4.5.4](https://github.com/marlonbarcarol/enigma-engine/pull/2)
  * [bump husky from 6.0.0 to 7.0.4](https://github.com/marlonbarcarol/enigma-engine/pull/3)
  * [bump eslint-plugin-prettier from 3.4.0 to 4.0.0](https://github.com/marlonbarcarol/enigma-engine/pull/4)
  * [bump eslint from 7.27.0 to 8.6.0](https://github.com/marlonbarcarol/enigma-engine/pull/5)
  * [bump @typescript-eslint/eslint-plugin from 4.26.0 to 5.9.1](https://github.com/marlonbarcarol/enigma-engine/pull/6)

### Features

* added factory method for cipher instantiation from JSON, and added more exports ([633e494](https://github.com/marlonbarcarol/enigma-engine/commit/633e494b374b9ad130ff4c85b0fd59b9e8b92c75))
* adding commitlint and husky to enforce it ([4d02510](https://github.com/marlonbarcarol/enigma-engine/commit/4d025102bdc80fe8690609c5c224b4faf6f235f5))
* adding versioning as well as commitlint make commands. ([818acef](https://github.com/marlonbarcarol/enigma-engine/commit/818acefcbc13e03da890dd7c9a63e74cd25e9c27))

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
