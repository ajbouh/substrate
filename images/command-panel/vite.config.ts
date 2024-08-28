import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	server: {
		port: +(process.env.PORT || 5173),
		strictPort: true
	},
	plugins: [sveltekit()]
};

export default config;
