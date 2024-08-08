import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
// import { resolve } from 'path';

export default defineConfig({
	plugins: [svelte()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	build: {
		lib: {
			entry: 'dist/index.js',
			name: 'CommandPanel',
			fileName: 'command-panel'
		},
		outDir: 'dist-bundle',
	}
});
