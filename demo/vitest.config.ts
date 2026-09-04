import react from '@vitejs/plugin-react';
import { defaultExclude, defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/setupTests.ts'],
		// Vitest's default file discovery also matches *.spec.ts, which
		// collides with the Playwright e2e suite (different test runner,
		// same file extension convention) -- exclude it explicitly.
		exclude: [...defaultExclude, './e2e/**'],
	},
});
