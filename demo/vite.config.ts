import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	base: '/enigma-engine/',
	plugins: [react()],
	optimizeDeps: {
		exclude: ['@enigmaciphy/engine'],
	},
});
