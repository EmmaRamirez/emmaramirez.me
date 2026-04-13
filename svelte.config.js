import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Process .svelte, .md, .mdx, and .mdsvex files
	extensions: ['.svelte', '.md', '.mdx', '.mdsvex'],

	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md', '.mdx', '.mdsvex']
		})
	],

	kit: {
		adapter: adapter(),
		alias: {
			$generated: './generated'
		}
	}
};

export default config;
