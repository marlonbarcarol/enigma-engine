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
