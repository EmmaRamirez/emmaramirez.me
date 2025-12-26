<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { theme } from '$lib/stores';
	import { onMount } from 'svelte';
	
	let { children } = $props();

	onMount(() => {
		theme.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- Prevent flash of wrong theme -->
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
