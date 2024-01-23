import adapterNode from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapterNode({
			out: 'build',
			precompress: false,
			envPrefix: '',
		}),
		paths: {
			base: "/ui",
		},
	},
};

export default config;
