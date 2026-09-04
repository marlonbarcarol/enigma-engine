# Enigma Visualizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an interactive, animated 2D visualization of an Enigma machine at a GitHub Pages URL, built on `@enigmaciphy/engine`, with a debug mode that traces exactly how a keypress travels through every component.

**Architecture:** Two phases. Phase A extends the engine itself (a pre-existing bug fix, then a new additive `encryptWithTrace` method), each shipped as its own npm release. Phase B builds an independent Vite + React + TypeScript SPA (`demo/`) that depends on the engine via a local `file:` reference, with a Playwright e2e suite gating a GitHub Actions deploy to GitHub Pages.

**Tech Stack:** Engine: existing TypeScript/Jest/ts-jest toolchain (unchanged). Demo: Vite, React 19, TypeScript, Vitest + React Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-04-enigma-visualizer-design.md`

## Global Constraints

- Engine changes must be additive/non-breaking except where explicitly fixing the bug in Task 1 — every one of the 53 existing tests in `src/**/*.spec.ts` must keep passing after every engine task.
- The demo (`demo/`) is `"private": true`, never published to npm, and has its own independent `package.json`/lockfile — do not add it to a root `workspaces` field or let its dependencies leak into the root `package.json`/`package-lock.json`.
- The demo depends on the engine via `"@enigmaciphy/engine": "file:../build"` — the root `build/` directory must exist (via `make build` at the repo root) before `npm install` runs inside `demo/`.
- v1 uses exactly one fixed, hardcoded machine configuration (see Task 6) — no configuration UI.
- Visual style is a detailed 2D SVG illustration — no 3D/WebGL.
- Every release step that runs `make npm.publish` requires interactive 2FA in the developer's own terminal (confirmed this session) — the plan calls this out explicitly at each release task rather than assuming it can run unattended.

---

## Phase A — Engine

### Task 1: Fix repeated `encrypt()` calls corrupting ring-shifted wiring

`Cipher.encrypt()` currently re-runs `rotor.connect()`/`rotor.configureRingWiring()` on every call. `configureRingWiring()` is not idempotent — it re-applies the ring-setting shift on top of the already-shifted wiring from any previous call. This was never caught because the library's documented usage pattern (README) always calls `encrypt()` once with a whole string, and its own example config uses `ring: 'A'` everywhere (a no-op shift) — so the compounding effect was invisible until now. Confirmed by direct testing during planning: `encrypt('AAAA')` in one call gives `'ZOMW'` for a config with `ring: 'B'` on the first rotor, but four separate `encrypt('A')` calls on the same instance give `'ZODX'`. With ring `'A'` (no-op), both approaches already agreed — isolating ring-shift compounding as the exact cause. The demo (Phase B) requires calling `encrypt()`/`encryptWithTrace()` once per real keystroke on one persistent `Cipher` instance, which is exactly the pattern that triggers this.

Fix: move the rotor `connect()`/`configureRingWiring()` setup out of `encrypt()`'s per-call body and into the `Cipher` constructor, so it runs exactly once per instance. Nothing in that setup depends on the plaintext being encrypted — only on `this.configuration.rotors`, fully known at construction time.

**Files:**
- Modify: `src/Cipher.ts:74-193`
- Test: `src/Cipher.spec.ts`

**Interfaces:**
- Produces: `Cipher`'s public behavior is unchanged for whole-string `encrypt()` calls; repeated single-character `encrypt()` calls on the same instance now produce output identical to one whole-string call with the same characters.

- [ ] **Step 1: Write the failing regression test**

Add to `src/Cipher.spec.ts`, inside the `describe('Can encrypt', ...)` block (after the last `test(...)` in that block, before its closing `});`):

```ts
		test('repeated encrypt() calls on the same instance do not corrupt ring-shifted wiring', () => {
			const configuration: CipherOptions = {
				alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
				rotors: [
					{ wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notches: ['Q'], ring: 'B' },
					{ wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notches: ['E'] },
					{ wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notches: ['V'] },
				],
				reflector: { wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT' },
			};

			const wholeStringCipher = Cipher.create(configuration);
			const wholeStringResult = wholeStringCipher.encrypt('AAAA');

			const perCharacterCipher = Cipher.create(configuration);
			let perCharacterResult = '';
			for (const letter of 'AAAA') {
				perCharacterResult += perCharacterCipher.encrypt(letter);
			}

			expect(perCharacterResult).toEqual(wholeStringResult);
			expect(wholeStringResult).toEqual('ZOMW');
		});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest src/Cipher.spec.ts -t "repeated encrypt"`
Expected: FAIL — `perCharacterResult` will be `'ZODX'`, not equal to `wholeStringResult` (`'ZOMW'`).

- [ ] **Step 3: Move the rotor setup into the constructor**

In `src/Cipher.ts`, find the constructor (currently ending at):

```ts
		for (const [index, rotor] of configuration.rotors.entries()) {
			if (characters.includes(rotor.wiring.input.order()) === false) {
				throw InvalidEnigmaAlphabetError.createForRotor(index, characters, rotor);
			}
		}

		this.configuration = configuration;
	}
```

Change the ending to:

```ts
		for (const [index, rotor] of configuration.rotors.entries()) {
			if (characters.includes(rotor.wiring.input.order()) === false) {
				throw InvalidEnigmaAlphabetError.createForRotor(index, characters, rotor);
			}
		}

		this.configuration = configuration;

		for (const [index, rotor] of configuration.rotors.entries()) {
			const previous = configuration.rotors[index - 1] ?? null;
			const next = configuration.rotors[index + 1] ?? null;

			rotor.connect(previous, next);
			rotor.configureRingWiring();
		}
	}
```

Then in `encrypt()`, remove the now-duplicate setup loop. Find:

```ts
		if (text.length === 0) {
			return '';
		}

		for (const [index, rotor] of this.configuration.rotors.entries()) {
			const previous = this.configuration.rotors[index - 1] ?? null;
			const next = this.configuration.rotors[index + 1] ?? null;

			rotor.connect(previous, next);
			rotor.configureRingWiring();
		}

		let characters: string[] = Array.from(text);
```

Change to:

```ts
		if (text.length === 0) {
			return '';
		}

		let characters: string[] = Array.from(text);
```

- [ ] **Step 4: Run the new test, then the full suite**

Run: `npx jest --silent`
Expected: `Tests: 54 passed, 54 total` (53 pre-existing + the 1 new regression test), zero failures.

- [ ] **Step 5: Run lint and type-check**

Run: `npx eslint --format codeframe '.' && npx tsc --noEmit -p .`
Expected: both exit with no output/errors.

- [ ] **Step 6: Commit**

```bash
git add src/Cipher.ts src/Cipher.spec.ts
git commit -m "$(cat <<'EOF'
fix: run rotor ring-wiring setup once per instance, not per encrypt() call

Cipher.encrypt() re-ran rotor.configureRingWiring() on every call.
That method isn't idempotent -- it re-applies the ring-setting shift
on top of the already-shifted wiring from any previous call. This was
invisible with the README's own example config (ring: 'A' everywhere,
a no-op shift) and with the documented one-call-per-message usage
pattern, but breaks as soon as a consumer calls encrypt() repeatedly
on the same instance with a non-zero ring setting -- e.g. once per
real keystroke, which an interactive UI needs to do.

Moved the rotor connect()/configureRingWiring() setup out of
encrypt()'s per-call body and into the constructor, so it runs
exactly once per Cipher instance.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VAaLNZr6D5dmVW8WBFjr2M
EOF
)"
```

---

### Task 2: Release engine 0.1.1 (bugfix)

**Files:** none (release tooling only — `Makefile`, `package.json` version field, `CHANGELOG.md` are all machine-updated by the existing `make version.bump` flow)

- [ ] **Step 1: Preview the version bump**

Run: `npx standard-version --dry-run`
Expected: shows a `fix:` entry bumping `0.1.0` → `0.1.1` (patch — `standard-version` treats a `fix:` commit with no `BREAKING CHANGE` footer as a patch release).

- [ ] **Step 2: Run the real version bump**

Run: `make version.bump`
Expected: bumps `package.json`/`package-lock.json` to `0.1.1`, updates `CHANGELOG.md`, creates a `chore(release): 0.1.1` commit, tags `v0.1.1` locally.

- [ ] **Step 3: Push the branch, then the tag (as two separate pushes)**

This repo's branch protection rejects pushes touching more than 2 refs at once — push the branch and the tag separately.

```bash
git push origin main
git push origin v0.1.1
```

- [ ] **Step 4: Publish to npm**

This step requires interactive 2FA and cannot run unattended — hand off to the user rather than attempting it directly.

Run: `make npm.publish`

If it prompts for a one-time password with a `npmjs.com/auth/cli/...` URL, that must be opened and approved in a real browser by whoever is running this command interactively — it cannot be completed from an automated/non-interactive session.

- [ ] **Step 5: Verify the published version**

Run: `npm view @enigmaciphy/engine version`
Expected: `0.1.1`

---

### Task 3: Add `encryptWithTrace()` — per-character signal-path tracing

Adds a new, additive `Cipher.encryptWithTrace(letter)` method returning both the output character and an ordered trace of every stage the signal passed through. Verified during planning against a hand-checked example (see Step 4) before writing this task.

Two files change:

1. `src/Configuration/Rotor/Rotor.ts` — `Rotor.process()` currently overrides `AbstractWiringProcessor.process(letter: string, pointer: number): string`. Adding a second parameter there for trace collection doesn't type-check (TypeScript rejects `RotorTraceHit[]` where the base class declares `pointer: number` in the same position — confirmed by attempting exactly this during planning: `TS2416: Property 'process' in type 'Rotor' is not assignable to the same property in base type 'AbstractWiringProcessor'`). Instead, `process()` stays untouched, and a new, separate method `processWithTrace()` carries the real logic (rotation + substitution + recursive chain walk), with `process()` becoming a one-line wrapper around it.
2. `src/Cipher.ts` — factors the per-character substitution logic (currently inline in `encrypt()`'s `.map()` callback) into a shared private method, `processCharacterWithTrace`, used by both `encrypt()` (bulk, trace discarded) and the new `encryptWithTrace()` (single character, trace returned).

**Files:**
- Modify: `src/Configuration/Rotor/Rotor.ts`
- Modify: `src/Cipher.ts`
- Modify: `src/main.ts` (export the 2 new public types)
- Test: `src/Cipher.spec.ts`

**Interfaces:**
- Produces:
  - `RotorTraceHit` (`src/Configuration/Rotor/Rotor.ts`): `{ rotor: Rotor; input: string; output: string }`
  - `Rotor.processWithTrace(letter: string, trace?: RotorTraceHit[]): string`
  - `CipherTraceStep` (`src/Cipher.ts`): `{ component: 'plugboard' | 'entry' | 'rotor' | 'reflector'; index?: number; direction?: 'in' | 'out' | 'reverse' | 'forward'; input: string; output: string; rotorPosition?: string }`
  - `CipherTraceResult` (`src/Cipher.ts`): `{ output: string; trace: CipherTraceStep[] }`
  - `Cipher.encryptWithTrace(letter: string): CipherTraceResult`

- [ ] **Step 1: Write the failing tests**

Add to `src/Cipher.spec.ts`, as a new top-level `describe` block right before the final closing `});` of the file (i.e., as a sibling of `describe('Can instantiate', ...)`, `describe('Can encrypt', ...)`, `describe('Can decrypt', ...)`):

```ts
	describe('Can trace', () => {
		const traceConfiguration: CipherOptions = {
			alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			plugboard: { wiring: 'AQRIJFHGDEWLTNSXBCOMZVKPYU' },
			entry: { wiring: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
			rotors: [
				{ wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notches: ['Q'] },
				{ wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notches: ['E'] },
				{ wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notches: ['V'] },
			],
			reflector: { wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT' },
		};

		test('produces the exact trace for the first letter of a known phrase', () => {
			const cipher = Cipher.create(traceConfiguration);

			const { output, trace } = cipher.encryptWithTrace('N');

			expect(output).toEqual('Y');
			expect(trace).toEqual([
				{ component: 'plugboard', direction: 'in', input: 'N', output: 'N' },
				{ component: 'entry', direction: 'in', input: 'N', output: 'N' },
				{
					component: 'rotor',
					index: 2,
					direction: 'reverse',
					input: 'N',
					output: 'X',
					rotorPosition: 'B',
				},
				{
					component: 'rotor',
					index: 1,
					direction: 'reverse',
					input: 'X',
					output: 'V',
					rotorPosition: 'A',
				},
				{
					component: 'rotor',
					index: 0,
					direction: 'reverse',
					input: 'V',
					output: 'I',
					rotorPosition: 'A',
				},
				{ component: 'reflector', input: 'I', output: 'P' },
				{
					component: 'rotor',
					index: 0,
					direction: 'forward',
					input: 'P',
					output: 'T',
					rotorPosition: 'A',
				},
				{
					component: 'rotor',
					index: 1,
					direction: 'forward',
					input: 'T',
					output: 'N',
					rotorPosition: 'A',
				},
				{
					component: 'rotor',
					index: 2,
					direction: 'forward',
					input: 'N',
					output: 'Y',
					rotorPosition: 'B',
				},
				{ component: 'entry', direction: 'out', input: 'Y', output: 'Y' },
				{ component: 'plugboard', direction: 'out', input: 'Y', output: 'Y' },
			]);
		});

		test('matches encrypt() letter-by-letter across a full phrase', () => {
			const bulkCipher = Cipher.create(traceConfiguration);
			const tracedCipher = Cipher.create(traceConfiguration);

			const plaintext = 'NEVERGONNAGIVEYOUUP';
			let bulkResult = '';
			let tracedResult = '';

			for (const letter of plaintext) {
				bulkResult += bulkCipher.encrypt(letter);
				tracedResult += tracedCipher.encryptWithTrace(letter).output;
			}

			expect(bulkResult).toEqual('YQBUNEVTVMPZZWRISJW');
			expect(tracedResult).toEqual(bulkResult);
		});

		test('throws when given anything other than exactly one alphabet character', () => {
			const cipher = Cipher.create(traceConfiguration);

			expect(() => cipher.encryptWithTrace('')).toThrow();
			expect(() => cipher.encryptWithTrace('AB')).toThrow();
			expect(() => cipher.encryptWithTrace('1')).toThrow();
		});
	});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx jest src/Cipher.spec.ts -t "Can trace"`
Expected: FAIL — `cipher.encryptWithTrace` is not a function.

- [ ] **Step 3: Add `RotorTraceHit` and `processWithTrace` to `Rotor.ts`**

In `src/Configuration/Rotor/Rotor.ts`, add the new interface after `RotorConfiguration`:

```ts
export interface RotorConfiguration {
	wiring: RotorWiring; // Required.
	position?: string; // Defaults to the first character of the input.
	notches?: string[]; // Defaults to no notches when not provided.
	ring?: RotorRing; // Defaults to the first character of the input.
	lock?: boolean; // Defaults to false, when true prevents wheel rotation.
}

export interface RotorTraceHit {
	rotor: Rotor;
	input: string;
	output: string;
}
```

Then replace the existing `process()` method:

```ts
	/**
	 * The core of a rotor is processing a letter.
	 */
	public process(letter: string): string {
		if (this.shouldRotate()) {
			this.rotate();
		}

		const char = super.process(letter, this.pointer);

		if (this.order === WiringProcessOrderEnum.INPUT_OUTPUT) {
			if (this.connection.next !== null) {
				return this.connection.next.process(char);
			}

			return char;
		}

		if (this.order === WiringProcessOrderEnum.OUTPUT_INPUT) {
			if (this.connection.previous !== null) {
				return this.connection.previous.process(char);
			}

			return char;
		}

		throw new Error(`Could not process unsupported wiring order ${this.order as string}.`);
	}
```

with:

```ts
	/**
	 * The core of a rotor is processing a letter.
	 */
	public process(letter: string): string {
		return this.processWithTrace(letter);
	}

	/**
	 * Same substitution/rotation logic as `process()`. Kept as a separate
	 * method (rather than a second parameter on `process()`) because
	 * `process()` overrides `AbstractWiringProcessor.process(letter, pointer:
	 * number)`, and a second parameter there must stay assignable to
	 * `number` -- it can't be repurposed for trace collection.
	 *
	 * `trace`, when provided, receives one entry per rotor visited during this
	 * call's traversal (including rotors visited recursively via `connection`),
	 * in the order they were actually processed.
	 */
	public processWithTrace(letter: string, trace?: RotorTraceHit[]): string {
		if (this.shouldRotate()) {
			this.rotate();
		}

		const char = super.process(letter, this.pointer);

		trace?.push({ rotor: this, input: letter, output: char });

		if (this.order === WiringProcessOrderEnum.INPUT_OUTPUT) {
			if (this.connection.next !== null) {
				return this.connection.next.processWithTrace(char, trace);
			}

			return char;
		}

		if (this.order === WiringProcessOrderEnum.OUTPUT_INPUT) {
			if (this.connection.previous !== null) {
				return this.connection.previous.processWithTrace(char, trace);
			}

			return char;
		}

		throw new Error(`Could not process unsupported wiring order ${this.order as string}.`);
	}
```

- [ ] **Step 4: Add the trace types and `encryptWithTrace()` to `Cipher.ts`**

In `src/Cipher.ts`, change the import line to also bring in `RotorTraceHit`:

```ts
import { Rotor } from './Configuration/Rotor/Rotor';
```

becomes:

```ts
import { Rotor, RotorTraceHit } from './Configuration/Rotor/Rotor';
```

Add the two new interfaces right after `CipherOptions`'s closing `}`:

```ts
export interface CipherTraceStep {
	component: 'plugboard' | 'entry' | 'rotor' | 'reflector';
	index?: number; // rotor index, only present when component === 'rotor'
	direction?: 'in' | 'out' | 'reverse' | 'forward';
	input: string;
	output: string;
	rotorPosition?: string; // the rotor's current-position letter, only for component === 'rotor'
}

export interface CipherTraceResult {
	output: string;
	trace: CipherTraceStep[];
}
```

Replace the body of `encrypt()`'s `.map()` callback plus everything after it (from `let characters: string[] = Array.from(text);` down to the closing `}` of the class) with a version that delegates to a new shared private method:

```ts
		let characters: string[] = Array.from(text);

		characters = characters.map((letter: string, index: number): string => {
			const { output } = this.processCharacterWithTrace(letter, false);

			if (this.configuration.chargroup === undefined || this.configuration.chargroup === null) {
				return output;
			}

			if (this.configuration.chargroup === 0) {
				return output;
			}

			if ((index + 1) % this.configuration.chargroup === 0) {
				return output.concat(' ');
			}

			return output;
		});

		text = characters.join('');
		text = text.trim();

		return text;
	}

	/**
	 * Like `encrypt()`, but for exactly one character, returning the full
	 * stage-by-stage trace of how that letter travelled through the machine:
	 * plugboard -> entry -> rotors (reverse) -> reflector -> rotors (forward)
	 * -> entry -> plugboard.
	 */
	public encryptWithTrace(letter: string): CipherTraceResult {
		let text: string = letter.toUpperCase();

		const escapedAlphabet = this.configuration.alphabet.characters.replace(/[-\\^\]]/g, '\\$&');
		const regex = new RegExp(`[^${escapedAlphabet}]+`, 'gm');
		text = text.replace(regex, '');

		if (text.length !== 1) {
			throw new Error(
				`encryptWithTrace() requires exactly one character from the alphabet "${this.configuration.alphabet.characters}", received "${letter}".`,
			);
		}

		const { output, trace } = this.processCharacterWithTrace(text, true);

		return { output, trace: trace as CipherTraceStep[] };
	}

	/**
	 * Runs a single letter through the full signal path, optionally collecting
	 * a step-by-step trace. Shared by `encrypt()` (bulk, trace discarded) and
	 * `encryptWithTrace()` (single character, trace returned), so the
	 * plugboard/entry/rotor/reflector traversal logic lives in exactly one
	 * place.
	 */
	private processCharacterWithTrace(
		letter: string,
		collectTrace: boolean,
	): { output: string; trace: CipherTraceStep[] | null } {
		const trace: CipherTraceStep[] | null = collectTrace ? [] : null;

		let char: string = letter;

		if (this.configuration.plugboard) {
			const input = char;
			char = this.configuration.plugboard.process(char);
			this.configuration.plugboard.flipOrder();
			trace?.push({ component: 'plugboard', direction: 'in', input, output: char });
		}

		if (this.configuration.entry) {
			const input = char;
			char = this.configuration.entry.process(char);
			this.configuration.entry.flipOrder();
			trace?.push({ component: 'entry', direction: 'in', input, output: char });
		}

		// Rotors are processed from reverse order
		if (this.configuration.rotors.length > 0) {
			const hits: RotorTraceHit[] = [];
			char = this.configuration.rotors[this.configuration.rotors.length - 1].processWithTrace(
				char,
				collectTrace ? hits : undefined,
			);

			for (const hit of hits) {
				trace?.push({
					component: 'rotor',
					index: this.configuration.rotors.indexOf(hit.rotor),
					direction: 'reverse',
					input: hit.input,
					output: hit.output,
					rotorPosition: hit.rotor.wiring.input.at(hit.rotor.cap()),
				});
			}
		}

		this.configuration.rotors.forEach((rotor) => rotor.flipOrder());

		if (this.configuration.reflector) {
			const input = char;
			char = this.configuration.reflector.process(char);
			trace?.push({ component: 'reflector', input, output: char });
		}

		if (this.configuration.rotors.length > 0) {
			const hits: RotorTraceHit[] = [];
			char = this.configuration.rotors[0].processWithTrace(char, collectTrace ? hits : undefined);

			for (const hit of hits) {
				trace?.push({
					component: 'rotor',
					index: this.configuration.rotors.indexOf(hit.rotor),
					direction: 'forward',
					input: hit.input,
					output: hit.output,
					rotorPosition: hit.rotor.wiring.input.at(hit.rotor.cap()),
				});
			}
		}

		if (this.configuration.entry) {
			const input = char;
			char = this.configuration.entry.process(char);
			this.configuration.entry.flipOrder();
			trace?.push({ component: 'entry', direction: 'out', input, output: char });
		}

		if (this.configuration.plugboard) {
			const input = char;
			char = this.configuration.plugboard.process(char);
			this.configuration.plugboard.flipOrder();
			trace?.push({ component: 'plugboard', direction: 'out', input, output: char });
		}

		this.configuration.rotors.forEach((rotor) => rotor.flipOrder());

		return { output: char, trace };
	}
}
```

- [ ] **Step 5: Export the new types from `src/main.ts`**

Change:

```ts
import { Cipher, CipherOptions } from './Cipher';
```

to:

```ts
import { Cipher, CipherOptions, CipherTraceResult, CipherTraceStep } from './Cipher';
```

Change:

```ts
import { Rotor, RotorConfiguration } from './Configuration/Rotor/Rotor';
```

to:

```ts
import { Rotor, RotorConfiguration, RotorTraceHit } from './Configuration/Rotor/Rotor';
```

In the `export { ... }` block, add `CipherTraceResult`, `CipherTraceStep`, and `RotorTraceHit` alphabetically:

```ts
export {
	AbstractWiringProcessor,
	Alphabet,
	Cipher,
	CipherOptions,
	CipherTraceResult,
	CipherTraceStep,
	EnigmaConfiguration,
	InvalidEnigmaAlphabetError,
	InvalidWiringAssociationError,
	InvalidWiringLengthError,
	Plugboard,
	Reflector,
	Rotor,
	RotorConfiguration,
	RotorRing,
	RotorTraceHit,
	RotorWiring,
	RotorWiringDirectionEnum,
	UniqueAlphabetCharacterError,
	Wheel,
	Wiring,
};
```

- [ ] **Step 6: Run the new tests, then the full suite**

Run: `npx jest --silent`
Expected: `Tests: 57 passed, 57 total` (54 from Task 1 + 3 new trace tests), zero failures.

- [ ] **Step 7: Run lint, type-check, and build**

Run: `npx eslint --format codeframe '.' && npx tsc --noEmit -p . && make build`
Expected: no lint/type errors; `build/` produced with no errors (confirms `Rotor.d.ts`/`Cipher.d.ts` generate cleanly with the new public types).

- [ ] **Step 8: Commit**

```bash
git add src/Configuration/Rotor/Rotor.ts src/Cipher.ts src/Cipher.spec.ts src/main.ts
git commit -m "$(cat <<'EOF'
feat: add Cipher.encryptWithTrace() for per-character signal-path tracing

Adds an additive, non-breaking method that processes exactly one
character and returns both the output letter and an ordered trace of
every stage it passed through: plugboard -> entry -> rotors (reverse)
-> reflector -> rotors (forward) -> entry -> plugboard.

Rotor.process() couldn't just grow a second parameter for trace
collection, since it overrides AbstractWiringProcessor.process(letter,
pointer: number) and TypeScript requires that parameter position to
stay assignable to number. Added a separate Rotor.processWithTrace()
method instead, with process() as a one-line wrapper -- zero behavior
change for existing callers.

Cipher.encrypt()'s per-character substitution logic (previously inline
in its .map() callback) is now a shared private
processCharacterWithTrace(), used by both encrypt() (bulk, trace
discarded) and encryptWithTrace() (single character, trace returned),
so the traversal logic lives in exactly one place.

Verified against a hand-checked trace for a known letter, and against
full-phrase consistency between encrypt() and encryptWithTrace()
across every letter of "NEVERGONNAGIVEYOUUP".

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VAaLNZr6D5dmVW8WBFjr2M
EOF
)"
```

---

### Task 4: Release engine 0.2.0 (feature)

**Files:** none (release tooling only)

- [ ] **Step 1: Preview the version bump**

Run: `npx standard-version --dry-run`
Expected: shows a `feat:` entry bumping `0.1.1` → `0.2.0` (minor — a `feat:` commit with no `BREAKING CHANGE` footer).

- [ ] **Step 2: Run the real version bump**

Run: `make version.bump`
Expected: bumps to `0.2.0`, updates `CHANGELOG.md`, creates a `chore(release): 0.2.0` commit, tags `v0.2.0` locally.

- [ ] **Step 3: Push the branch, then the tag**

```bash
git push origin main
git push origin v0.2.0
```

- [ ] **Step 4: Publish to npm**

Same as Task 2, Step 4 — requires interactive 2FA, hand off to the user.

Run: `make npm.publish`

- [ ] **Step 5: Verify the published version**

Run: `npm view @enigmaciphy/engine version`
Expected: `0.2.0`

- [ ] **Step 6: Build the engine locally for Phase B**

Phase B's demo app depends on `build/`, which is gitignored and not restored by a fresh clone. Regenerate it now so Task 5 can proceed:

Run: `make build`
Expected: `build/` populated, including `build/package.json` with `"version": "0.2.0"`.

---

## Phase B — Demo app

### Task 5: Scaffold the demo app

Creates `demo/` as an independent Vite + React + TypeScript project with its own `package.json`/lockfile, depending on the engine via `file:../build`.

**Files:**
- Create: `demo/package.json`
- Create: `demo/tsconfig.json`
- Create: `demo/tsconfig.node.json`
- Create: `demo/vite.config.ts`
- Create: `demo/index.html`
- Create: `demo/src/main.tsx`
- Create: `demo/src/App.tsx`
- Create: `demo/src/App.css`
- Create: `demo/.gitignore`
- Create: `demo/README.md`

**Interfaces:**
- Consumes: `@enigmaciphy/engine` (built at `../build`, produced by Task 4 Step 6).
- Produces: a working `npm run dev` / `npm run build` in `demo/`, ready for Task 6 onward to build on.

- [ ] **Step 1: Create `demo/package.json`**

```json
{
	"name": "enigma-visualizer-demo",
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc -b && vite build",
		"preview": "vite preview",
		"test": "vitest run",
		"e2e": "playwright test"
	},
	"dependencies": {
		"@enigmaciphy/engine": "file:../build",
		"react": "^19.2.8",
		"react-dom": "^19.2.8"
	},
	"devDependencies": {
		"@playwright/test": "^1.62.1",
		"@testing-library/jest-dom": "^7.0.1",
		"@testing-library/react": "^16.3.3",
		"@types/react": "^19.2.8",
		"@types/react-dom": "^19.2.8",
		"@vitejs/plugin-react": "^6.1.1",
		"jsdom": "^30.0.1",
		"typescript": "^7.0.2",
		"vite": "^8.2.2",
		"vitest": "^5.0.0"
	}
}
```

- [ ] **Step 2: Create `demo/tsconfig.json`**

```json
{
	"compilerOptions": {
		"target": "ES2022",
		"lib": ["ES2022", "DOM", "DOM.Iterable"],
		"module": "ESNext",
		"moduleResolution": "bundler",
		"jsx": "react-jsx",
		"strict": true,
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"noFallthroughCasesInSwitch": true,
		"esModuleInterop": true,
		"skipLibCheck": true,
		"isolatedModules": true,
		"resolveJsonModule": true,
		"noEmit": true
	},
	"include": ["src"],
	"references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Create `demo/tsconfig.node.json`**

```json
{
	"compilerOptions": {
		"target": "ES2022",
		"module": "ESNext",
		"moduleResolution": "bundler",
		"strict": true,
		"noEmit": true,
		"types": ["node"]
	},
	"include": ["vite.config.ts", "playwright.config.ts"]
}
```

- [ ] **Step 4: Create `demo/vite.config.ts`**

The `optimizeDeps.exclude` entry is deliberate: Vite pre-bundles and caches dependencies, and since `@enigmaciphy/engine` is a `file:`-linked local package we'll be actively changing (or rebuilding after future engine releases), excluding it from that cache keeps `npm run dev` picking up rebuilds without manual cache-clearing.

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	base: '/enigma-engine/',
	plugins: [react()],
	optimizeDeps: {
		exclude: ['@enigmaciphy/engine'],
	},
});
```

- [ ] **Step 5: Create `demo/index.html`**

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Enigma Visualizer</title>
	</head>
	<body>
		<div id="root"></div>
		<script type="module" src="/src/main.tsx"></script>
	</body>
</html>
```

- [ ] **Step 6: Create `demo/src/main.tsx`**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
```

- [ ] **Step 7: Create a placeholder `demo/src/App.tsx`**

This gets replaced/extended in later tasks — for now, just enough to prove the app boots.

```tsx
function App() {
	return (
		<main data-testid="app">
			<h1>Enigma Visualizer</h1>
		</main>
	);
}

export default App;
```

- [ ] **Step 8: Create `demo/src/App.css`**

```css
:root {
	color-scheme: light dark;
	font-family:
		system-ui,
		-apple-system,
		'Segoe UI',
		sans-serif;
}

body {
	margin: 0;
	background: #1a1a1a;
	color: #f0f0f0;
}
```

- [ ] **Step 9: Create `demo/.gitignore`**

```
node_modules
dist
test-results
playwright-report
```

- [ ] **Step 10: Create `demo/README.md`**

```markdown
# Enigma Visualizer

An interactive, animated visualization of an Enigma machine, built on
[`@enigmaciphy/engine`](https://www.npmjs.com/package/@enigmaciphy/engine).

## Prerequisite

This app depends on the engine via `file:../build`, so the engine must be
built first:

```bash
cd .. && make build
```

## Development

```bash
npm install
npm run dev
```

## Testing

```bash
npm test        # Vitest component tests
npm run build && npm run e2e   # Playwright e2e, against the production build
```
```

- [ ] **Step 11: Install and verify the app boots**

Run (from `demo/`):

```bash
npm install
npm run build
npx vite preview --port 4173 &
sleep 2
curl -s http://localhost:4173/enigma-engine/ | grep -q "Enigma Visualizer" && echo "OK: page served" || echo "FAIL"
kill %1
```

Expected: `OK: page served`.

- [ ] **Step 12: Commit**

```bash
git add demo/
git commit -m "$(cat <<'EOF'
feat(demo): scaffold Vite + React + TypeScript visualizer app

Independent app at demo/, its own package.json and lockfile, fully
decoupled from the engine's own toolchain/audit surface. Depends on
@enigmaciphy/engine via file:../build (a symlink to the engine's own
published-package output), so local development sees engine changes
without needing an npm publish.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VAaLNZr6D5dmVW8WBFjr2M
EOF
)"
```

---

### Task 6: `useCipher` hook with the fixed v1 machine configuration

**Files:**
- Create: `demo/src/config.ts`
- Create: `demo/src/hooks/useCipher.ts`
- Create: `demo/src/hooks/useCipher.test.ts`
- Create: `demo/vitest.config.ts`
- Create: `demo/src/setupTests.ts`

**Interfaces:**
- Consumes: `Cipher`, `CipherOptions`, `CipherTraceStep` from `@enigmaciphy/engine`.
- Produces: `useCipher()` hook returning `{ ciphertext: string; skippedCount: number; debugMode: boolean; setDebugMode: (v: boolean) => void; lastTrace: CipherTraceStep[] | null; rotorPositions: string[]; pressKey: (letter: string) => void }`, consumed by Task 7 onward.

- [ ] **Step 1: Create `demo/src/config.ts`**

This is the README's own example configuration (matching the engine's documented usage), minus `chargroup` (not needed for live, per-key typing) — verified during planning to encrypt `"NEVER GONNA GIVE YOU UP"` to exactly `YQBUNEVTVMPZZWRISJW`.

```ts
import { CipherOptions } from '@enigmaciphy/engine';

export const MACHINE_CONFIG: CipherOptions = {
	alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	plugboard: { wiring: 'AQRIJFHGDEWLTNSXBCOMZVKPYU' },
	entry: { wiring: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
	rotors: [
		{ wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notches: ['Q'] },
		{ wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notches: ['E'] },
		{ wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notches: ['V'] },
	],
	reflector: { wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT' },
};

export const ROTOR_COUNT = MACHINE_CONFIG.rotors.length;
```

- [ ] **Step 2: Create `demo/vitest.config.ts`**

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/setupTests.ts'],
	},
});
```

- [ ] **Step 3: Create `demo/src/setupTests.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Write the failing test**

```ts
// demo/src/hooks/useCipher.test.ts
import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useCipher } from './useCipher';

describe('useCipher', () => {
	test('pressKey updates the ciphertext and tracks skipped characters', () => {
		const { result } = renderHook(() => useCipher());

		expect(result.current.ciphertext).toEqual('');

		act(() => {
			result.current.pressKey('N');
		});

		expect(result.current.ciphertext).toEqual('Y');
		expect(result.current.skippedCount).toEqual(0);

		act(() => {
			result.current.pressKey(' ');
		});

		expect(result.current.ciphertext).toEqual('Y');
		expect(result.current.skippedCount).toEqual(1);
	});

	test('debug mode populates lastTrace after a keypress', () => {
		const { result } = renderHook(() => useCipher());

		expect(result.current.lastTrace).toBeNull();

		act(() => {
			result.current.setDebugMode(true);
		});

		act(() => {
			result.current.pressKey('N');
		});

		expect(result.current.lastTrace).not.toBeNull();
		expect(result.current.lastTrace).toHaveLength(11);
	});

	test('encrypting the full phrase matches the verified reference ciphertext', () => {
		const { result } = renderHook(() => useCipher());

		act(() => {
			for (const letter of 'NEVER GONNA GIVE YOU UP') {
				result.current.pressKey(letter);
			}
		});

		expect(result.current.ciphertext).toEqual('YQBUNEVTVMPZZWRISJW');
	});
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run (from `demo/`): `npx vitest run src/hooks/useCipher.test.ts`
Expected: FAIL — cannot find module `./useCipher`.

- [ ] **Step 6: Implement `useCipher`**

```ts
// demo/src/hooks/useCipher.ts
import { Cipher, CipherTraceStep } from '@enigmaciphy/engine';
import { useCallback, useMemo, useRef, useState } from 'react';
import { MACHINE_CONFIG, ROTOR_COUNT } from '../config';

export interface UseCipherResult {
	ciphertext: string;
	skippedCount: number;
	debugMode: boolean;
	setDebugMode: (value: boolean) => void;
	lastTrace: CipherTraceStep[] | null;
	rotorPositions: string[];
	pressKey: (letter: string) => void;
}

function currentRotorPositions(cipher: Cipher): string[] {
	return cipher.configuration.rotors.map((rotor) => rotor.wiring.input.at(rotor.cap()));
}

export function useCipher(): UseCipherResult {
	const cipherRef = useRef<Cipher>();
	if (!cipherRef.current) {
		cipherRef.current = Cipher.create(MACHINE_CONFIG);
	}

	const [ciphertext, setCiphertext] = useState('');
	const [skippedCount, setSkippedCount] = useState(0);
	const [debugMode, setDebugMode] = useState(false);
	const [lastTrace, setLastTrace] = useState<CipherTraceStep[] | null>(null);
	const [rotorPositions, setRotorPositions] = useState<string[]>(() =>
		Array(ROTOR_COUNT).fill('A'),
	);

	const pressKey = useCallback(
		(letter: string) => {
			const cipher = cipherRef.current as Cipher;

			if (debugMode) {
				try {
					const { output, trace } = cipher.encryptWithTrace(letter);
					setCiphertext((previous) => previous + output);
					setLastTrace(trace);
					setRotorPositions(currentRotorPositions(cipher));
					return;
				} catch {
					setSkippedCount((previous) => previous + 1);
					return;
				}
			}

			const before = ciphertext;
			const output = cipher.encrypt(letter);

			if (output.length === 0) {
				setSkippedCount((previous) => previous + 1);
				return;
			}

			setCiphertext(before + output);
			setRotorPositions(currentRotorPositions(cipher));
		},
		[ciphertext, debugMode],
	);

	return useMemo(
		() => ({
			ciphertext,
			skippedCount,
			debugMode,
			setDebugMode,
			lastTrace,
			rotorPositions,
			pressKey,
		}),
		[ciphertext, skippedCount, debugMode, lastTrace, rotorPositions, pressKey],
	);
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run (from `demo/`): `npx vitest run src/hooks/useCipher.test.ts`
Expected: `3 passed`.

- [ ] **Step 8: Commit**

```bash
git add demo/vitest.config.ts demo/src/setupTests.ts demo/src/config.ts demo/src/hooks/
git commit -m "$(cat <<'EOF'
feat(demo): add useCipher hook with the fixed v1 machine configuration

Owns one persistent Cipher instance across keypresses (required, since
rotor position is stateful) and exposes pressKey(letter), branching to
encrypt() or encryptWithTrace() based on the debug-mode toggle.

Verified against the reference ciphertext for "NEVER GONNA GIVE YOU
UP" computed during planning against this exact configuration.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VAaLNZr6D5dmVW8WBFjr2M
EOF
)"
```

---

### Task 7: Machine visualization components

Builds the 2D SVG illustration: plugboard, entry wheel, three rotors, reflector, composed into one `Machine` component. Presentational only — receives state as props, no engine calls of its own.

**Files:**
- Create: `demo/src/components/Rotor.tsx`
- Create: `demo/src/components/Reflector.tsx`
- Create: `demo/src/components/Plugboard.tsx`
- Create: `demo/src/components/EntryWheel.tsx`
- Create: `demo/src/components/Machine.tsx`
- Create: `demo/src/components/Machine.css`
- Create: `demo/src/components/Machine.test.tsx`

**Interfaces:**
- Consumes: `rotorPositions: string[]` (from `useCipher`, Task 6), an optional `highlightedComponent?: { component: string; index?: number }` (used by Task 9's debug playback to light up the part currently being traced).
- Produces: `<Machine rotorPositions={...} highlightedComponent={...} />`, rendering `data-testid="plugboard"`, `data-testid="entry-wheel"`, `data-testid="rotor-0"`.."rotor-2"`, `data-testid="reflector"`.

- [ ] **Step 1: Create `demo/src/components/Rotor.tsx`**

A rotor drawn as a cylinder (two concentric circles for depth), a tick mark ring, and the current letter shown at the top, rotating via a CSS `transform`.

```tsx
interface RotorProps {
	index: number;
	position: string; // current letter, e.g. 'A'
	highlighted?: boolean;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function Rotor({ index, position, highlighted }: RotorProps) {
	const rotationDegrees = (ALPHABET.indexOf(position) / ALPHABET.length) * 360;

	return (
		<g
			data-testid={`rotor-${index}`}
			className={highlighted ? 'rotor rotor--highlighted' : 'rotor'}
			transform={`translate(${60 + index * 90}, 100)`}
		>
			<circle r="38" className="rotor__body" />
			<circle r="30" className="rotor__inner" />
			<g className="rotor__dial" style={{ transform: `rotate(${rotationDegrees}deg)` }}>
				{Array.from({ length: 26 }, (_, tick) => {
					const angle = (tick / 26) * 2 * Math.PI;
					const x1 = Math.sin(angle) * 30;
					const y1 = -Math.cos(angle) * 30;
					const x2 = Math.sin(angle) * 34;
					const y2 = -Math.cos(angle) * 34;
					return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} className="rotor__tick" />;
				})}
			</g>
			<text className="rotor__letter" textAnchor="middle" dy="6">
				{position}
			</text>
		</g>
	);
}

export default Rotor;
```

- [ ] **Step 2: Create `demo/src/components/Reflector.tsx`**

```tsx
interface ReflectorProps {
	highlighted?: boolean;
}

function Reflector({ highlighted }: ReflectorProps) {
	return (
		<g
			data-testid="reflector"
			className={highlighted ? 'reflector reflector--highlighted' : 'reflector'}
			transform="translate(330, 100)"
		>
			<circle r="34" className="reflector__body" />
			<path d="M -20 -10 Q 0 20 20 -10" className="reflector__wiring" />
			<path d="M -20 10 Q 0 -20 20 10" className="reflector__wiring" />
		</g>
	);
}

export default Reflector;
```

- [ ] **Step 3: Create `demo/src/components/Plugboard.tsx`**

```tsx
interface PlugboardProps {
	highlighted?: boolean;
}

function Plugboard({ highlighted }: PlugboardProps) {
	return (
		<g
			data-testid="plugboard"
			className={highlighted ? 'plugboard plugboard--highlighted' : 'plugboard'}
			transform="translate(60, 220)"
		>
			<rect x="-50" y="-20" width="220" height="40" rx="6" className="plugboard__body" />
			{Array.from({ length: 6 }, (_, socket) => (
				<circle key={socket} cx={-30 + socket * 40} cy="0" r="6" className="plugboard__socket" />
			))}
		</g>
	);
}

export default Plugboard;
```

- [ ] **Step 4: Create `demo/src/components/EntryWheel.tsx`**

```tsx
interface EntryWheelProps {
	highlighted?: boolean;
}

function EntryWheel({ highlighted }: EntryWheelProps) {
	return (
		<g
			data-testid="entry-wheel"
			className={highlighted ? 'entry-wheel entry-wheel--highlighted' : 'entry-wheel'}
			transform="translate(20, 100)"
		>
			<circle r="20" className="entry-wheel__body" />
		</g>
	);
}

export default EntryWheel;
```

- [ ] **Step 5: Create `demo/src/components/Machine.tsx`**

```tsx
import EntryWheel from './EntryWheel';
import Plugboard from './Plugboard';
import Reflector from './Reflector';
import Rotor from './Rotor';

export interface HighlightedComponent {
	component: 'plugboard' | 'entry' | 'rotor' | 'reflector';
	index?: number;
}

interface MachineProps {
	rotorPositions: string[];
	highlightedComponent?: HighlightedComponent | null;
}

function isHighlighted(
	highlighted: HighlightedComponent | null | undefined,
	component: HighlightedComponent['component'],
	index?: number,
): boolean {
	if (!highlighted || highlighted.component !== component) {
		return false;
	}

	return highlighted.index === undefined || highlighted.index === index;
}

function Machine({ rotorPositions, highlightedComponent }: MachineProps) {
	return (
		<svg data-testid="machine" viewBox="0 0 420 280" role="img" aria-label="Enigma machine">
			<EntryWheel highlighted={isHighlighted(highlightedComponent, 'entry')} />
			{rotorPositions.map((position, index) => (
				<Rotor
					key={index}
					index={index}
					position={position}
					highlighted={isHighlighted(highlightedComponent, 'rotor', index)}
				/>
			))}
			<Reflector highlighted={isHighlighted(highlightedComponent, 'reflector')} />
			<Plugboard highlighted={isHighlighted(highlightedComponent, 'plugboard')} />
		</svg>
	);
}

export default Machine;
```

- [ ] **Step 6: Create `demo/src/components/Machine.css`**

```css
.machine {
	max-width: 480px;
}

.rotor__body {
	fill: #3a3a3a;
	stroke: #888;
	stroke-width: 2;
}

.rotor__inner {
	fill: #2a2a2a;
}

.rotor__tick {
	stroke: #666;
	stroke-width: 1;
}

.rotor__dial {
	transition: transform 0.3s ease-out;
	transform-origin: center;
}

.rotor__letter {
	fill: #f0f0f0;
	font-size: 16px;
	font-weight: bold;
}

.rotor--highlighted .rotor__body {
	stroke: #ffcc00;
	stroke-width: 3;
}

.reflector__body {
	fill: #4a3a2a;
	stroke: #888;
	stroke-width: 2;
}

.reflector__wiring {
	fill: none;
	stroke: #ccaa66;
	stroke-width: 2;
}

.reflector--highlighted .reflector__body {
	stroke: #ffcc00;
	stroke-width: 3;
}

.plugboard__body {
	fill: #2a2a3a;
	stroke: #888;
	stroke-width: 2;
}

.plugboard__socket {
	fill: #111;
	stroke: #999;
}

.plugboard--highlighted .plugboard__body {
	stroke: #ffcc00;
	stroke-width: 3;
}

.entry-wheel__body {
	fill: #3a3a4a;
	stroke: #888;
	stroke-width: 2;
}

.entry-wheel--highlighted .entry-wheel__body {
	stroke: #ffcc00;
	stroke-width: 3;
}
```

Import it once, in `demo/src/App.tsx` (added in Task 8) — Vite bundles CSS imports regardless of which component file imports them.

- [ ] **Step 7: Write the component test**

```tsx
// demo/src/components/Machine.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Machine from './Machine';

describe('Machine', () => {
	test('renders every component of the machine', () => {
		render(<Machine rotorPositions={['A', 'B', 'C']} />);

		expect(screen.getByTestId('plugboard')).toBeInTheDocument();
		expect(screen.getByTestId('entry-wheel')).toBeInTheDocument();
		expect(screen.getByTestId('rotor-0')).toBeInTheDocument();
		expect(screen.getByTestId('rotor-1')).toBeInTheDocument();
		expect(screen.getByTestId('rotor-2')).toBeInTheDocument();
		expect(screen.getByTestId('reflector')).toBeInTheDocument();
	});

	test('highlights only the specified rotor', () => {
		render(
			<Machine
				rotorPositions={['A', 'B', 'C']}
				highlightedComponent={{ component: 'rotor', index: 1 }}
			/>,
		);

		expect(screen.getByTestId('rotor-1').getAttribute('class')).toContain('rotor--highlighted');
		expect(screen.getByTestId('rotor-0').getAttribute('class')).not.toContain(
			'rotor--highlighted',
		);
	});
});
```

- [ ] **Step 8: Run the tests**

Run (from `demo/`): `npx vitest run src/components/Machine.test.tsx`
Expected: `2 passed`.

- [ ] **Step 9: Commit**

```bash
git add demo/src/components/
git commit -m "$(cat <<'EOF'
feat(demo): add SVG machine visualization components

Plugboard, EntryWheel, Rotor (x3), Reflector composed into one
Machine component. Presentational only -- takes rotor positions and
an optional highlighted-component descriptor as props, used by the
debug-mode trace playback (added in a later task) to light up
whichever part is currently being traced.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VAaLNZr6D5dmVW8WBFjr2M
EOF
)"
```

---

### Task 8: Wire typing into the app, with skipped-character indication

**Files:**
- Create: `demo/src/components/Keyboard.tsx`
- Modify: `demo/src/App.tsx`
- Create: `demo/src/App.test.tsx`

**Interfaces:**
- Consumes: `useCipher()` (Task 6), `Machine` (Task 7).
- Produces: a working typing loop — `data-testid="plaintext-input"`, `data-testid="ciphertext-output"`, `data-testid="skipped-count"`.

- [ ] **Step 1: Create `demo/src/components/Keyboard.tsx`**

```tsx
import { useState } from 'react';

interface KeyboardProps {
	onKeyPress: (letter: string) => void;
}

function Keyboard({ onKeyPress }: KeyboardProps) {
	const [value, setValue] = useState('');

	return (
		<input
			data-testid="plaintext-input"
			type="text"
			value={value}
			placeholder="Type a message..."
			onChange={(event) => {
				const nextValue = event.target.value;
				const addedChars = nextValue.slice(value.length);

				setValue(nextValue);

				for (const char of addedChars) {
					onKeyPress(char);
				}
			}}
		/>
	);
}

export default Keyboard;
```

Note: this only handles forward typing (appending characters), not mid-string edits or deletions — sufficient for v1's "type and watch it animate" interaction, and matches a real Enigma's one-way, non-editable keystroke model (you can't take back a keystroke on a real machine either).

- [ ] **Step 2: Write the failing app-level test**

```tsx
// demo/src/App.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import App from './App';

describe('App', () => {
	test('typing updates the ciphertext output', () => {
		render(<App />);

		const input = screen.getByTestId('plaintext-input');
		fireEvent.change(input, { target: { value: 'N' } });

		expect(screen.getByTestId('ciphertext-output')).toHaveTextContent('Y');
	});

	test('typing a space increments the skipped-character count without adding ciphertext', () => {
		render(<App />);

		const input = screen.getByTestId('plaintext-input');
		fireEvent.change(input, { target: { value: 'N ' } });

		expect(screen.getByTestId('ciphertext-output')).toHaveTextContent('Y');
		expect(screen.getByTestId('skipped-count')).toHaveTextContent('1');
	});
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run (from `demo/`): `npx vitest run src/App.test.tsx`
Expected: FAIL — `data-testid="plaintext-input"` not found (current `App.tsx` is still the Task 5 placeholder).

- [ ] **Step 4: Implement `demo/src/App.tsx`**

```tsx
import Machine from './components/Machine';
import './components/Machine.css';
import Keyboard from './components/Keyboard';
import { useCipher } from './hooks/useCipher';

function App() {
	const { ciphertext, skippedCount, rotorPositions, pressKey, debugMode, setDebugMode } =
		useCipher();

	return (
		<main data-testid="app">
			<h1>Enigma Visualizer</h1>

			<Machine rotorPositions={rotorPositions} />

			<label>
				<input
					type="checkbox"
					checked={debugMode}
					onChange={(event) => setDebugMode(event.target.checked)}
					data-testid="debug-toggle"
				/>
				Debug mode
			</label>

			<Keyboard onKeyPress={pressKey} />

			<p>
				Ciphertext: <output data-testid="ciphertext-output">{ciphertext}</output>
			</p>
			<p>
				Skipped characters: <span data-testid="skipped-count">{skippedCount}</span>
			</p>
		</main>
	);
}

export default App;
```

- [ ] **Step 5: Run the tests to verify they pass**

Run (from `demo/`): `npx vitest run`
Expected: all component/hook tests pass (`App.test.tsx`, `Machine.test.tsx`, `useCipher.test.ts`).

- [ ] **Step 6: Commit**

```bash
git add demo/src/components/Keyboard.tsx demo/src/App.tsx demo/src/App.test.tsx
git commit -m "$(cat <<'EOF'
feat(demo): wire typing into the machine, with skipped-character count

Keyboard is a plain text input that fires onKeyPress once per newly
typed character (append-only -- no mid-string edits, matching a real
Enigma's one-way keystroke model). Characters outside the configured
alphabet (e.g. spaces) are visibly counted rather than silently
dropped, since encrypt() already strips them internally and a
teaching tool shouldn't hide that.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VAaLNZr6D5dmVW8WBFjr2M
EOF
)"
```

---

### Task 9: Debug mode — trace panel and sequential highlight playback

**Files:**
- Create: `demo/src/components/DebugPanel.tsx`
- Create: `demo/src/components/DebugPanel.test.tsx`
- Modify: `demo/src/App.tsx`

**Interfaces:**
- Consumes: `lastTrace: CipherTraceStep[] | null` (from `useCipher`, Task 6), `Machine`'s `highlightedComponent` prop (Task 7).
- Produces: `<DebugPanel trace={...} onStepChange={(step) => void} />`, rendering one `data-testid="trace-step"` element per trace step.

- [ ] **Step 1: Write the failing test**

```tsx
// demo/src/components/DebugPanel.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import DebugPanel from './DebugPanel';
import { CipherTraceStep } from '@enigmaciphy/engine';

const sampleTrace: CipherTraceStep[] = [
	{ component: 'plugboard', direction: 'in', input: 'N', output: 'N' },
	{ component: 'entry', direction: 'in', input: 'N', output: 'N' },
	{ component: 'reflector', input: 'N', output: 'P' },
];

describe('DebugPanel', () => {
	test('renders one row per trace step', () => {
		render(<DebugPanel trace={sampleTrace} />);

		expect(screen.getAllByTestId('trace-step')).toHaveLength(3);
	});

	test('renders nothing when there is no trace yet', () => {
		render(<DebugPanel trace={null} />);

		expect(screen.queryAllByTestId('trace-step')).toHaveLength(0);
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run (from `demo/`): `npx vitest run src/components/DebugPanel.test.tsx`
Expected: FAIL — cannot find module `./DebugPanel`.

- [ ] **Step 3: Implement `DebugPanel`**

Plays the trace back one step at a time via `setTimeout`, calling `onStepChange` with each step's `{ component, index }` so the caller (`App`) can feed it straight into `Machine`'s `highlightedComponent` prop.

```tsx
import { useEffect, useState } from 'react';
import { CipherTraceStep } from '@enigmaciphy/engine';

interface DebugPanelProps {
	trace: CipherTraceStep[] | null;
	onStepChange?: (step: CipherTraceStep | null) => void;
}

const STEP_DELAY_MS = 400;

function DebugPanel({ trace, onStepChange }: DebugPanelProps) {
	const [activeIndex, setActiveIndex] = useState(-1);

	useEffect(() => {
		if (!trace) {
			setActiveIndex(-1);
			onStepChange?.(null);
			return;
		}

		let cancelled = false;
		let index = 0;

		function playNextStep() {
			if (cancelled || !trace || index >= trace.length) {
				return;
			}

			setActiveIndex(index);
			onStepChange?.(trace[index]);
			index += 1;
			setTimeout(playNextStep, STEP_DELAY_MS);
		}

		playNextStep();

		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [trace]);

	if (!trace) {
		return null;
	}

	return (
		<ol data-testid="debug-panel">
			{trace.map((step, index) => (
				<li
					key={index}
					data-testid="trace-step"
					className={index === activeIndex ? 'trace-step trace-step--active' : 'trace-step'}
				>
					{step.component}
					{step.direction ? ` (${step.direction})` : ''}
					{step.index !== undefined ? ` #${step.index}` : ''}: {step.input} → {step.output}
					{step.rotorPosition ? ` [pos: ${step.rotorPosition}]` : ''}
				</li>
			))}
		</ol>
	);
}

export default DebugPanel;
```

- [ ] **Step 4: Run the test to verify it passes**

Run (from `demo/`): `npx vitest run src/components/DebugPanel.test.tsx`
Expected: `2 passed`.

- [ ] **Step 5: Wire `DebugPanel` into `App.tsx`**

Change the import section of `demo/src/App.tsx`:

```tsx
import Machine from './components/Machine';
import './components/Machine.css';
import Keyboard from './components/Keyboard';
import { useCipher } from './hooks/useCipher';
```

to:

```tsx
import { useState } from 'react';
import { CipherTraceStep } from '@enigmaciphy/engine';
import Machine, { HighlightedComponent } from './components/Machine';
import './components/Machine.css';
import DebugPanel from './components/DebugPanel';
import Keyboard from './components/Keyboard';
import { useCipher } from './hooks/useCipher';
```

Change the function body:

```tsx
function App() {
	const { ciphertext, skippedCount, rotorPositions, pressKey, debugMode, setDebugMode } =
		useCipher();

	return (
		<main data-testid="app">
			<h1>Enigma Visualizer</h1>

			<Machine rotorPositions={rotorPositions} />
```

to:

```tsx
function App() {
	const { ciphertext, skippedCount, rotorPositions, pressKey, debugMode, setDebugMode, lastTrace } =
		useCipher();
	const [highlightedComponent, setHighlightedComponent] = useState<HighlightedComponent | null>(
		null,
	);

	function handleStepChange(step: CipherTraceStep | null) {
		setHighlightedComponent(step ? { component: step.component, index: step.index } : null);
	}

	return (
		<main data-testid="app">
			<h1>Enigma Visualizer</h1>

			<Machine rotorPositions={rotorPositions} highlightedComponent={highlightedComponent} />
```

Then, right after the closing `</Keyboard>`-equivalent line (`<Keyboard onKeyPress={pressKey} />`), add:

```tsx
			{debugMode && <DebugPanel trace={lastTrace} onStepChange={handleStepChange} />}
```

- [ ] **Step 6: Run the full demo test suite**

Run (from `demo/`): `npx vitest run`
Expected: all tests across `App.test.tsx`, `Machine.test.tsx`, `DebugPanel.test.tsx`, `useCipher.test.ts` pass.

- [ ] **Step 7: Commit**

```bash
git add demo/src/components/DebugPanel.tsx demo/src/components/DebugPanel.test.tsx demo/src/App.tsx
git commit -m "$(cat <<'EOF'
feat(demo): add debug-mode trace panel with sequential playback

DebugPanel walks a CipherTraceStep[] one step at a time and reports
each active step upward, which App feeds into Machine's
highlightedComponent prop -- so the part of the machine currently
being traced visibly lights up in sync with the trace list.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VAaLNZr6D5dmVW8WBFjr2M
EOF
)"
```

---

### Task 10: Playwright e2e smoke suite

**Files:**
- Create: `demo/playwright.config.ts`
- Create: `demo/e2e/machine.spec.ts`

**Interfaces:**
- Consumes: the built app served via `vite preview` (not the dev server).

- [ ] **Step 1: Install Playwright browsers**

Run (from `demo/`): `npx playwright install --with-deps chromium`
Expected: downloads/installs the Chromium browser Playwright drives.

- [ ] **Step 2: Create `demo/playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	webServer: {
		command: 'npm run build && npm run preview -- --port 4173',
		port: 4173,
		reuseExistingServer: false,
		timeout: 120_000,
	},
	use: {
		baseURL: 'http://localhost:4173/enigma-engine/',
	},
});
```

- [ ] **Step 3: Write the e2e tests**

The exact ciphertext value (`YQBUNEVTVMPZZWRISJW`) is the same one verified during planning and already asserted in `useCipher.test.ts` (Task 6) — reused here for an end-to-end check through the real rendered UI, not just the hook in isolation.

```ts
// demo/e2e/machine.spec.ts
import { expect, test } from '@playwright/test';

test('the machine renders with all its components', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByTestId('machine')).toBeVisible();
	await expect(page.getByTestId('plugboard')).toBeVisible();
	await expect(page.getByTestId('entry-wheel')).toBeVisible();
	await expect(page.getByTestId('rotor-0')).toBeVisible();
	await expect(page.getByTestId('rotor-1')).toBeVisible();
	await expect(page.getByTestId('rotor-2')).toBeVisible();
	await expect(page.getByTestId('reflector')).toBeVisible();
});

test('typing a full phrase produces the correct ciphertext, including a stripped space', async ({
	page,
}) => {
	await page.goto('/');

	await page.getByTestId('plaintext-input').fill('NEVER GONNA GIVE YOU UP');

	await expect(page.getByTestId('ciphertext-output')).toHaveText('YQBUNEVTVMPZZWRISJW');
	await expect(page.getByTestId('skipped-count')).toHaveText('4'); // 4 spaces in the phrase
});

test('encrypt/decrypt symmetry holds through the rendered UI', async ({ page, context }) => {
	await page.goto('/');
	await page.getByTestId('plaintext-input').fill('NEVER GONNA GIVE YOU UP');
	const ciphertext = await page.getByTestId('ciphertext-output').innerText();

	const decryptPage = await context.newPage();
	await decryptPage.goto('/');
	await decryptPage.getByTestId('plaintext-input').fill(ciphertext);

	await expect(decryptPage.getByTestId('ciphertext-output')).toHaveText('NEVERGONNAGIVEYOUUP');
});

test('debug mode shows the full trace for a keypress', async ({ page }) => {
	await page.goto('/');

	await page.getByTestId('debug-toggle').check();
	await page.getByTestId('plaintext-input').fill('N');

	await expect(page.getByTestId('debug-panel')).toBeVisible();
	await expect(page.getByTestId('trace-step')).toHaveCount(11);
});
```

- [ ] **Step 4: Run the e2e suite**

Run (from `demo/`): `npx playwright test`
Expected: `4 passed`.

- [ ] **Step 5: Add `demo/playwright-report/` and `demo/test-results/` to `.gitignore`**

Already covered by Task 5 Step 9's `demo/.gitignore` (`test-results` and `playwright-report` are already listed) — verify:

Run: `cat demo/.gitignore`
Expected: includes `test-results` and `playwright-report`.

- [ ] **Step 6: Commit**

```bash
git add demo/playwright.config.ts demo/e2e/
git commit -m "$(cat <<'EOF'
test(demo): add Playwright e2e smoke suite

Runs against the actual production build (via `vite preview`, per
playwright.config.ts's webServer command), not the dev server --
testing what would really ship. Four tests: the machine renders with
every component present, typing "NEVER GONNA GIVE YOU UP" produces
the verified ciphertext (and correctly counts its 4 stripped spaces),
encrypt/decrypt symmetry holds through the real rendered UI, and debug
mode shows the full 11-step trace for a keypress.

Deliberately not exhaustive -- no rotor-combination matrix, no
cross-browser coverage. This catches real build/deploy/integration
breakage; it's meant to gate the deploy workflow, not replace
component-level testing.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VAaLNZr6D5dmVW8WBFjr2M
EOF
)"
```

---

### Task 11: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy-demo.yml`

**Interfaces:** none (CI configuration only).

- [ ] **Step 1: Create the workflow**

Builds the engine first (`build/` is gitignored, so CI must regenerate it before `demo/`'s `file:../build` dependency can resolve), then builds and e2e-tests the demo, and only deploys on success.

```yaml
name: Deploy Demo

on:
  push:
    branches:
      - main
    paths:
      - 'demo/**'
      - 'src/**'
      - '.github/workflows/deploy-demo.yml'
  workflow_dispatch: ~

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: '24'

      - name: Build the engine
        run: |
          npm ci --ignore-scripts
          make build

      - name: Install demo dependencies
        working-directory: demo
        run: npm ci

      - name: Install Playwright browsers
        working-directory: demo
        run: npx playwright install --with-deps chromium

      - name: Run demo unit tests
        working-directory: demo
        run: npm test

      # `npm run e2e` runs Playwright, whose webServer command (see
      # playwright.config.ts) is `npm run build && npm run preview`, so this
      # single step both builds demo/dist and tests against it -- no
      # separate build step needed here, and `npx playwright test` alone
      # keeps working the same way for local development.
      - name: Run e2e suite (builds demo/dist as part of its webServer step)
        working-directory: demo
        run: npm run e2e

      - uses: actions/upload-pages-artifact@v4
        with:
          path: demo/dist

  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Validate the workflow YAML syntax**

Run: `npx -y js-yaml .github/workflows/deploy-demo.yml > /dev/null && echo "valid YAML"`
Expected: `valid YAML`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy-demo.yml
git commit -m "$(cat <<'EOF'
ci: add GitHub Pages deploy workflow for the demo app

Triggers on pushes touching demo/ or src/ (an engine change can affect
the demo even without a demo/ file changing), plus manual dispatch.
Builds the engine first, since build/ is gitignored and must be
regenerated in CI before demo/'s file:../build dependency can resolve.
Runs the demo's unit and e2e suites as a gate -- deploy only proceeds
on success, so a broken build never reaches the live Pages URL.

GitHub Pages was already switched to "GitHub Actions" as its source in
repo settings (done manually, confirmed by the user).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VAaLNZr6D5dmVW8WBFjr2M
EOF
)"
```

- [ ] **Step 4: Push and watch the workflow run**

```bash
git push origin main
gh run list --repo marlonbarcarol/enigma-engine --workflow=deploy-demo.yml --limit 1
```

Wait for it to complete (`gh run watch <run-id> --repo marlonbarcarol/enigma-engine` or repeated `gh run view`), then confirm success:

Run: `gh run view <run-id> --repo marlonbarcarol/enigma-engine`
Expected: `✓` conclusion, and the `deploy` job's output URL resolves to `https://marlonbarcarol.github.io/enigma-engine/` showing the running visualizer.
