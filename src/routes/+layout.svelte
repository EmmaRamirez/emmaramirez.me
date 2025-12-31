<script lang="ts">
	import '../app.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { theme } from '$lib/stores';
	import { onMount } from 'svelte';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';

	import { dev } from '$app/environment';
	
	let { children } = $props();

	injectAnalytics({ mode: dev ? 'development' : 'production' });
	injectSpeedInsights();

	onMount(() => {
		theme.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script>
		(function() {
			const stored = localStorage.getItem('theme');
			const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			const theme = stored || preferred;
			if (theme === 'dark') {
				document.documentElement.classList.add('dark');
			}
		})();
	</script>
</svelte:head>

<main>
	{#key page.url.pathname}
		<div
			class="page-transition-wrapper"
			in:fade={{ duration: 300, delay: 150 }}
			out:fade={{ duration: 200 }}
		>
			{@render children()}
		</div>
	{/key}
</main>

<style>
	.page-transition-wrapper {
		min-height: 100vh;
	}
</style>
