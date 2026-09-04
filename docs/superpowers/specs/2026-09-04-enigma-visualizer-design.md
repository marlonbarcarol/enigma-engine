# Enigma Visualizer — Design Spec

## Purpose

A new subproject, `demo/`, inside this repo: an interactive, browser-based
visualization of an Enigma machine, built on top of the published
`@enigmaciphy/engine` package. It renders the machine's components (plugboard,
entry wheel, rotors, reflector) as a realistic 2D illustration that animates
as letters are typed, and offers a debug mode that traces exactly how a single
keypress travels through every stage of the machine.

This is a teaching/showcase tool, not a production service. Scope is
deliberately kept to a single, fixed machine configuration for v1.

## Out of scope (for this spec)

- A machine-configuration UI (choosing rotors, ring settings, plugboard
  wiring, etc. interactively). v1 ships with one fixed, hardcoded
  configuration (the same one used in the README's usage example).
- 3D rendering. Visual style is a detailed 2D SVG illustration.
- Deep/exhaustive e2e coverage. A thin smoke-level suite only (see Testing).
- Any change to the engine's existing public API surface — the only engine
  change is a new, additive method.

These are natural candidates for a future iteration, once v1 is live.

## Architecture

Two independent pieces:

1. **Engine addition** (repo root, `src/`): a new method on `Cipher`,
   `encryptWithTrace(letter: string)`, additive and non-breaking. Ships as a
   semver-minor bump (`0.1.0` → `0.2.0`) once merged, following the same
   release flow (`make version.bump` → push → `make npm.publish`) used for
   the `0.1.0` release.
2. **Demo app** (`demo/` at repo root): an independent Vite + React +
   TypeScript SPA with its own `package.json`, lockfile, and CI/lint/audit
   surface — fully decoupled from the engine's toolchain.

### Why a separate dependency tree, not an npm workspace

A true npm workspace (`"workspaces": ["demo"]` on the root `package.json`)
would hoist the demo's dependencies (React, Vite, animation/testing tooling)
into the same root `node_modules` and lockfile as the engine. The engine's
toolchain was just brought to a fully audited, minimal, `0` vulnerabilities
state (see `CHANGELOG.md` `0.1.0` era commits) — merging in a full frontend
stack's dependency tree would immediately reintroduce that audit surface and
couple two unrelated release cadences (engine devDeps vs. frontend framework
bumps) into one lockfile/PR stream.

Instead, `demo/package.json` depends on the engine via:

```json
"@enigmaciphy/engine": "file:../build"
```

npm treats a local directory `file:` dependency as a symlink (not a copy),
so local development always sees the latest built engine code — including
the new `encryptWithTrace` method — without needing an interim npm publish.
Pointing at `../build` (not `../src`) matters: `build/` is exactly what
`make npm.publish` ships, so the demo exercises the real public package shape
(resolved via `main`/`types` in `build/package.json`), not internal source
layout.

### Why not Next.js or Astro

- **Next.js**: its core value (SSR, API routes, image optimization, server
  data fetching) solves problems this project doesn't have — it's a purely
  client-side, stateful, interactive tool with no server-rendering need.
  Static export to GitHub Pages is possible but fights the framework's
  defaults the whole way for no benefit over a plain Vite SPA.
- **Astro**: its strength is islands architecture — near-zero JS for mostly
  static content, with small interactive islands hydrated only where needed.
  This app is confirmed to be *just* the interactive simulator (no
  surrounding written/explainer content), so the entire page is one large
  interactive island anyway — Astro's core benefit doesn't apply, and it
  would only add an extra build layer on top of whatever renders that island.

## Engine change: `encryptWithTrace`

### API shape

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

// On Cipher:
public encryptWithTrace(letter: string): CipherTraceResult
```

`encryptWithTrace` requires exactly one character (after the same
alphabet-sanitization `encrypt()` already applies); passing zero or more than
one valid character throws (mirrors the existing style of validation errors
in this codebase, e.g. `InvalidEnigmaAlphabetError`).

Trace steps follow the same order as the signal path already implemented in
`Cipher.encrypt()`'s per-character loop: plugboard → entry → rotors in
reverse order (last to first) → reflector → rotors in forward order (first to
last) → entry → plugboard. Note that the plugboard and entry wheel each
appear as **two** separate trace steps — once on the way in, once on the way
back out — matching the two `process()` calls each already gets inside
`encrypt()`. Their `direction` field distinguishes the pair (`'in'` vs.
`'out'`); rotor steps use `'reverse'`/`'forward'` instead, and the reflector
appears exactly once with no `direction` set. Each rotor hop's
`rotorPosition` reflects the rotor's position *after* any
stepping/double-stepping for that keypress has already occurred — i.e., the
same position the letter was actually substituted at.

### Implementation approach

`Cipher.encrypt()`'s current per-character logic (the callback inside
`characters.map(...)` in `src/Cipher.ts`) gets factored into a shared private
method, e.g. `processCharacterWithTrace(letter, collectTrace: boolean)`,
returning `{ output, trace: CipherTraceStep[] | null }`. `encrypt()` calls it
per character with `collectTrace: false` and ignores the trace (existing
behavior unchanged, no performance regression for bulk encryption).
`encryptWithTrace()` calls it once with `collectTrace: true` and returns the
full result. This avoids duplicating the plugboard/entry/rotor/reflector
traversal logic between two code paths.

`CipherTraceStep` and `CipherTraceResult` get added to `src/main.ts`'s export
list alongside every other public type, following this repo's existing
pattern (every exported class/interface is re-exported there, consumed via
`import { ... } from '@enigmaciphy/engine'`).

## Demo app

### Structure

```
demo/
  package.json          (private: true, depends on @enigmaciphy/engine via file:../build)
  vite.config.ts         (base: '/enigma-engine/')
  src/
    App.tsx              (top-level state: debug toggle, typed text, ciphertext-so-far)
    hooks/
      useCipher.ts        (owns the persistent Cipher instance; exposes pressKey(letter))
    components/
      Machine.tsx         (composes the SVG illustration; presentational)
      Plugboard.tsx
      EntryWheel.tsx
      Rotor.tsx           (one instance per rotor; rotation position as a prop)
      Reflector.tsx
      DebugPanel.tsx      (renders/animates trace steps from encryptWithTrace)
      Keyboard.tsx        (on-screen keys + text input)
  e2e/
    machine.spec.ts        (Playwright, see Testing)
  vitest.config.ts
```

### State & data flow

`useCipher` holds one `Cipher` instance (constructed once via
`Cipher.create(...)` with the fixed v1 configuration) in React state — it
must persist across keypresses, since rotor position is stateful and the
engine's encrypt/decrypt symmetry depends on sequential calls against the
same instance (documented on `Cipher.encrypt()` itself).

Flow per keypress:

1. User types or clicks a key → `pressKey(letter)`.
2. If debug mode is off: call `cipher.encrypt(letter)` (bulk API, single
   character), update rotor-position state and the running
   ciphertext-so-far display.
3. If debug mode is on: call `cipher.encryptWithTrace(letter)`, update the
   same rotor-position/ciphertext state, and additionally store the returned
   `trace` array in state.
4. `Machine` re-renders with the new rotor positions — a CSS
   `transform: rotate(...)` transition animates the visual turn.
5. If debug mode is on, `DebugPanel` walks the trace array in sequence
   (via `setTimeout`-chained steps, revisit with a small animation-sequencing
   helper only if this becomes unwieldy), highlighting the matching component
   in `Machine` for each step as it plays.

### Error handling

v1 ships one fixed configuration, so there's minimal user-triggerable engine
error surface. The one real case: `Cipher.encrypt()` (and by extension
`encryptWithTrace`) already silently strips characters outside the
configured alphabet. For a teaching/debug tool, silently dropping input is
the wrong UX — the demo should visibly flag skipped characters (e.g., a
greyed-out or strikethrough treatment on the typed-input display) rather than
mimicking the library's silent-strip behavior.

## Testing

### Engine (`src/Cipher.spec.ts` or a new `Cipher.trace.spec.ts`)

- Each trace step's `input`/`output` matches what the existing wiring/rotor
  unit tests already establish for those components in isolation.
- Feeding the same single letter to `encrypt()` and to
  `encryptWithTrace(...).output` (against two freshly constructed, identically
  configured ciphers) produces the same result — a consistency check between
  the bulk and traced code paths.
- Trace step count matches the expected stage count for the fixed
  configuration's rotor/plugboard/entry-wheel setup.

### Demo components (Vitest + React Testing Library)

Light touch — a small number of smoke-level component tests (e.g., the app
renders, a keypress updates the displayed ciphertext), not exhaustive
coverage. This is a visual tool; heavy component-test investment has low ROI
here relative to the e2e smoke suite below.

### E2E (Playwright, `demo/e2e/`)

Runs against `vite preview` serving the actual production build
(`demo/dist`), not the dev server — testing what would really ship. Acts as
a **gate in the deploy workflow**: on failure, the deploy step does not run.

Test list:

1. Page loads; the machine renders (plugboard, entry wheel, rotors, reflector
   all present in the DOM/visible).
2. Typing `NEVER GONNA GIVE YOU UP` updates the displayed ciphertext
   (non-empty, differs from the input, exercises real rotor stepping across a
   full phrase rather than a single keystroke, and confirms the space
   character is silently stripped as the engine's sanitizer already does).
3. Encrypting `NEVER GONNA GIVE YOU UP` on one fresh machine instance, then
   feeding that ciphertext into a second fresh machine instance with the same
   configuration, reproduces the original text — encrypt/decrypt symmetry,
   verified through the actual rendered UI rather than only at the engine
   level.
4. Toggling debug mode on and pressing a key shows the trace panel with the
   expected number of stage-steps for the fixed configuration.

Deliberately excluded: exhaustive rotor-combination coverage, cross-browser
matrices, every debug-mode interaction path. This is a showcase tool; the
above catches real build/deploy/integration breakage (the failure mode that
actually matters for a public demo) without disproportionate e2e maintenance
burden.

## Deployment

New workflow, `.github/workflows/deploy-demo.yml`:

- Triggers: push to `main` with `paths: ['demo/**']`, plus manual
  `workflow_dispatch`.
- Node 24 (matching `checkup.yml`).
- `npm ci` + `npm run build` inside `demo/` (independent lockfile).
- Playwright e2e suite runs against `vite preview` serving `demo/dist` — gate
  on success.
- On success: `actions/upload-pages-artifact` (artifact = `demo/dist`) →
  `actions/deploy-pages`.

`vite.config.ts` sets `base: '/enigma-engine/'` to match the GitHub Pages
project-page URL (`https://marlonbarcarol.github.io/enigma-engine/`).

GitHub Pages is already configured with source = "GitHub Actions" in repo
settings (done manually, confirmed).

## Versioning

The engine's `encryptWithTrace` addition ships as its own release
(`0.1.0` → `0.2.0`) through the existing `make version.bump` /
`make npm.publish` flow, before the demo app's `file:../build` dependency can
build. The demo app itself is `"private": true` and never published to npm.
