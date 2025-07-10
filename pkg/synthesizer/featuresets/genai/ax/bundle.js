// build.js
import fs from 'node:fs/promises';
import { build } from 'esbuild';
// import { nodeModulesPolyfillPlugin } from './node_modules/esbuild-plugins-node-modules-polyfill/dist/index.js';

// This async function is the core of our build process
async function runBuild() {
  try {
    const result = await build({
      // --- Your build options from the CLI go here ---
      entryPoints: ['index.js'], // Your main JS file
      bundle: true,
      minify: false,
      define: {
        'process.env.PROXY': 'undefined',
      },
      format: 'esm',
      outfile: 'ax.js',
      platform: 'browser',
      target: 'ES2022', // Or your desired browser target
      sourcemap: true,
      metafile: true,
      plugins: [
        // nodeModulesPolyfillPlugin({}),
      ],
    });

    if (result.metafile) {
      // use https://esbuild.github.io/analyze/ to analyses
      await fs.writeFile('./metafile.json', JSON.stringify(result.metafile));
    }

    console.log('✅ Build finished successfully!');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

// Execute the build
runBuild();
