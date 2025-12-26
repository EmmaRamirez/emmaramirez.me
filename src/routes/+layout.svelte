<script lang="ts">
	import '../app.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { theme } from '$lib/stores';
	import { onMount } from 'svelte';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

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
	{@render children()}
</main>
