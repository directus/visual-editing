import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'tsup';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { version } = JSON.parse(await readFile(join(__dirname, './package.json'), 'utf8'));

const env = process.env.NODE_ENV;

export default defineConfig(() => ({
	sourcemap: env === 'production', // source map is only available in prod
	clean: true, // clean dist before build
	dts: true, // generate dts file for main module
	format: ['cjs', 'esm', 'iife'], // generate cjs, esm and global iife files
	globalName: 'DirectusVisualEditing', // global variable name for iife
	minify: env === 'production',
	watch: env === 'development',
	bundle: true,
	target: 'es2022',
	entry: ['src/index.ts'],
	esbuildOptions(options) {
		// fetch source from GitHub
		options.sourceRoot = `https://raw.githubusercontent.com/directus/visual-editing/v${version}/dist/`;
		options.sourcesContent = false;

		// rename global script
		if (options.format === 'iife') {
			options.entryPoints = { 'visual-editing': 'src/index.ts' };
			options.outExtension = { '.js': '.js' };
		}
	},
}));
