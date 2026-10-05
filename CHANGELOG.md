# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.2.0 (2026-10-05)


### ⚠ BREAKING CHANGES

* CipherJSON is now CipherOptions, and Cipher.fromJSON
is now Cipher.create. Update imports and call sites accordingly:

  import { Cipher, CipherOptions } from '@enigmaciphy/engine';
  const cipher = Cipher.create(options);

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VAaLNZr6D5dmVW8WBFjr2M

### Features

* add Cipher.encryptWithTrace() for per-character signal-path tracing ([4b74e5a](https://github.com/marlonbarcarol/enigma-engine/commit/4b74e5a69783a30b73d84b3ef1ec74d035dcb9fe))
* **demo:** add a favicon and page metadata ([16229e0](https://github.com/marlonbarcarol/enigma-engine/commit/16229e0423d0720b50bd170966959bb389471355))
* **demo:** add debug-mode trace panel with sequential playback ([07b160a](https://github.com/marlonbarcarol/enigma-engine/commit/07b160a0f96856e46799493852f7f80612c36965))
* **demo:** add SVG machine visualization components ([3b38d6b](https://github.com/marlonbarcarol/enigma-engine/commit/3b38d6bd81397fd7c621eabe4015b562762af260))
* **demo:** add useCipher hook with the fixed v1 machine configuration ([996cda0](https://github.com/marlonbarcarol/enigma-engine/commit/996cda0e11da27f7ab6ed69424860e2d0ea81d69))
* **demo:** credit the library in the header with a link to npm ([7364bd3](https://github.com/marlonbarcarol/enigma-engine/commit/7364bd36343877f07cf24e7836cff193833fccd6))
* **demo:** explain how the machine works and how to use the library ([ba9009d](https://github.com/marlonbarcarol/enigma-engine/commit/ba9009dcf4c40f4829f4783596767072ae3aec24))
* **demo:** label every part of the machine ([28f6350](https://github.com/marlonbarcarol/enigma-engine/commit/28f6350edbd4887afa9187dcb8bea116ae21075f))
* **demo:** rebuild the visualizer to actually look like an Enigma machine ([0555028](https://github.com/marlonbarcarol/enigma-engine/commit/055502817ba10f27bf0a98b1d3a635fac63094c0))
* **demo:** scaffold Vite + React + TypeScript visualizer app ([22cfea0](https://github.com/marlonbarcarol/enigma-engine/commit/22cfea097006bcb3d90c8a75c73b3f24bbf08fbc))
* **demo:** two-column layout, working edits, and a configurable key sheet ([956f309](https://github.com/marlonbarcarol/enigma-engine/commit/956f30949d4f4392023885f721687b8fbbae2739))
* **demo:** wire typing into the machine, with skipped-character count ([496c24a](https://github.com/marlonbarcarol/enigma-engine/commit/496c24a49cedc02a3e0f212c988c5ddc35e2bb74))
* expose rotor ring settings and reflector position via CipherJSON ([506d51b](https://github.com/marlonbarcarol/enigma-engine/commit/506d51b9dc8ab25908a68510a304bd882342c320))


### Bug Fixes

* **cipher:** throw InvalidTraceLetterError instead of bare Error ([cdddcc6](https://github.com/marlonbarcarol/enigma-engine/commit/cdddcc656365256978297b6cdf3e98ded7f8fd4c))
* **demo:** constrain machine width and style the debug playback highlight ([87e94b8](https://github.com/marlonbarcarol/enigma-engine/commit/87e94b85c5f59394e65f508bb94139a8d5158e04)), closes [#ffcc00](https://github.com/marlonbarcarol/enigma-engine/issues/ffcc00)
* **demo:** exclude e2e/ from Vitest's test discovery ([2b96e17](https://github.com/marlonbarcarol/enigma-engine/commit/2b96e17a5fd559b8990fb37a4b9eb021c302766c))
* **demo:** fix TypeScript config isolation and prevent stale config artifacts ([3a8ace1](https://github.com/marlonbarcarol/enigma-engine/commit/3a8ace1dc0e3d777ca8abadd56b8627a62b152bb))
* **demo:** only treat InvalidTraceLetterError as a debug-mode skip ([f25262b](https://github.com/marlonbarcarol/enigma-engine/commit/f25262be395af5386489808252cf302f6716c5c7))
* escape special regex characters in alphabet sanitizer ([a5b2ec7](https://github.com/marlonbarcarol/enigma-engine/commit/a5b2ec78294ce410add7eac479a2266421cc850f))
* run rotor ring-wiring setup once per instance, not per encrypt() call ([36650f3](https://github.com/marlonbarcarol/enigma-engine/commit/36650f32b53fca887e814c1812182452434ddc9f))


* rename CipherJSON/fromJSON to CipherOptions/create ([a527f74](https://github.com/marlonbarcarol/enigma-engine/commit/a527f74e10029ac22926e65189fc97f912a7a06c))

### [0.1.3](https://github.com/marlonbarcarol/enigma-engine/compare/v0.1.2...v0.1.3) (2026-09-09)


### Features

* **demo:** add a favicon and page metadata ([16229e0](https://github.com/marlonbarcarol/enigma-engine/commit/16229e0423d0720b50bd170966959bb389471355))
* **demo:** add debug-mode trace panel with sequential playback ([07b160a](https://github.com/marlonbarcarol/enigma-engine/commit/07b160a0f96856e46799493852f7f80612c36965))
* **demo:** add SVG machine visualization components ([3b38d6b](https://github.com/marlonbarcarol/enigma-engine/commit/3b38d6bd81397fd7c621eabe4015b562762af260))
* **demo:** add useCipher hook with the fixed v1 machine configuration ([996cda0](https://github.com/marlonbarcarol/enigma-engine/commit/996cda0e11da27f7ab6ed69424860e2d0ea81d69))
* **demo:** credit the library in the header with a link to npm ([7364bd3](https://github.com/marlonbarcarol/enigma-engine/commit/7364bd36343877f07cf24e7836cff193833fccd6))
* **demo:** explain how the machine works and how to use the library ([ba9009d](https://github.com/marlonbarcarol/enigma-engine/commit/ba9009dcf4c40f4829f4783596767072ae3aec24))
* **demo:** label every part of the machine ([28f6350](https://github.com/marlonbarcarol/enigma-engine/commit/28f6350edbd4887afa9187dcb8bea116ae21075f))
* **demo:** rebuild the visualizer to actually look like an Enigma machine ([0555028](https://github.com/marlonbarcarol/enigma-engine/commit/055502817ba10f27bf0a98b1d3a635fac63094c0))
* **demo:** scaffold Vite + React + TypeScript visualizer app ([22cfea0](https://github.com/marlonbarcarol/enigma-engine/commit/22cfea097006bcb3d90c8a75c73b3f24bbf08fbc))
* **demo:** two-column layout, working edits, and a configurable key sheet ([956f309](https://github.com/marlonbarcarol/enigma-engine/commit/956f30949d4f4392023885f721687b8fbbae2739))
* **demo:** wire typing into the machine, with skipped-character count ([496c24a](https://github.com/marlonbarcarol/enigma-engine/commit/496c24a49cedc02a3e0f212c988c5ddc35e2bb74))


### Bug Fixes

* **cipher:** throw InvalidTraceLetterError instead of bare Error ([cdddcc6](https://github.com/marlonbarcarol/enigma-engine/commit/cdddcc656365256978297b6cdf3e98ded7f8fd4c))
* **demo:** constrain machine width and style the debug playback highlight ([87e94b8](https://github.com/marlonbarcarol/enigma-engine/commit/87e94b85c5f59394e65f508bb94139a8d5158e04)), closes [#ffcc00](https://github.com/marlonbarcarol/enigma-engine/issues/ffcc00)
* **demo:** exclude e2e/ from Vitest's test discovery ([2b96e17](https://github.com/marlonbarcarol/enigma-engine/commit/2b96e17a5fd559b8990fb37a4b9eb021c302766c))
* **demo:** fix TypeScript config isolation and prevent stale config artifacts ([3a8ace1](https://github.com/marlonbarcarol/enigma-engine/commit/3a8ace1dc0e3d777ca8abadd56b8627a62b152bb))
* **demo:** only treat InvalidTraceLetterError as a debug-mode skip ([f25262b](https://github.com/marlonbarcarol/enigma-engine/commit/f25262be395af5386489808252cf302f6716c5c7))

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
