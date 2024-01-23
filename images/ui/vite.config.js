import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	server: {
		port: +(process.env.PORT || 5173),
		strictPort: true,
	},
	// esbuild: {
	// 	// HACK(adamb) This is to avoid ulid aborting at runtime with:
	// 	//     Error: secure crypto unusable, insecure Math.random not allowed
	// 	//   This is a gross hack to account for the fact that the ulid package
	// 	//   uses a dynamic require that esbuild transforms 
	// 	banner: [
	// 		`import { createRequire as topLevelCreateRequire } from 'module'`,
	// 		`const require = topLevelCreateRequire(import.meta.url)`
	// 	].join('\n'),
	// },
	plugins: [sveltekit()]
};

export default config;
