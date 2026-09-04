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
