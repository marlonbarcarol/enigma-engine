# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
