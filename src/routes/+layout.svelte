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
	import StickerLayer from '$lib/components/stickers/StickerLayer.svelte';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import { dev } from '$app/environment';

	let { children } = $props();
	const isHomeRoute = $derived(page.url.pathname === '/');
	const isEditorRoute = $derived(page.url.pathname.startsWith('/editor'));

	injectAnalytics({ mode: dev ? 'development' : 'production' });
	injectSpeedInsights();

	onMount(() => {
		theme.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script>
		(function () {
			const settingsKey = 'emzinnia:user-settings';
			let stored = null;
			try {
				const raw = localStorage.getItem(settingsKey);
				if (raw) {
					const parsed = JSON.parse(raw);
					if (parsed?.theme === 'light' || parsed?.theme === 'dark') {
						stored = parsed.theme;
					}
				}
			} catch {}
			stored = stored || localStorage.getItem('theme');
			const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';
			const theme = stored || preferred;
			if (theme === 'dark') {
				document.documentElement.classList.add('dark');
			}
		})();
	</script>
</svelte:head>

<Header sticky>
	<HeaderLogo />
	<HeaderNav>
		<HeaderNavItem href="/" active={isHomeRoute}>Home</HeaderNavItem>
		{#if dev}
			<HeaderNavItem href="/editor" active={isEditorRoute}>Editor</HeaderNavItem>
		{/if}
		<ThemeToggle class="ml-2" />
	</HeaderNav>
</Header>

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

<StickerLayer />

<style>
	.page-transition-wrapper {
		min-height: 100vh;
	}
</style>
