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
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	import { browser, dev } from '$app/environment';
	import { performanceAnalytics } from '$lib/stores/performanceAnalytics.svelte';

	let { children } = $props();
	let navigationMeasureId: string | null = null;
	let hasCapturedInitialLoad = false;

	injectAnalytics({ mode: dev ? 'development' : 'production' });
	injectSpeedInsights();

	if (browser && dev) {
		performanceAnalytics.init();
		performanceAnalytics.setCurrentRoute(page.url.pathname);
	}

	beforeNavigate(({ to, from }) => {
		if (!dev || !hasCapturedInitialLoad || !to?.url) return;

		navigationMeasureId = performanceAnalytics.beginMeasure('page', to.url.pathname, {
			route: to.url.pathname,
			navigationType: 'navigate',
			from: from?.url.pathname ?? page.url.pathname
		});
	});

	afterNavigate(({ to }) => {
		if (!dev) return;

		const route = to?.url.pathname ?? page.url.pathname;
		performanceAnalytics.setCurrentRoute(route);

		if (!hasCapturedInitialLoad && browser) {
			hasCapturedInitialLoad = true;
			const navigationEntry = performance.getEntriesByType('navigation')[0] as
				| PerformanceNavigationTiming
				| undefined;

			if (navigationEntry) {
				performanceAnalytics.recordPageLoad(route, navigationEntry.duration, 'load');
				performanceAnalytics.recordVital(
					'TTFB',
					navigationEntry.responseStart,
					'ms',
					route,
					'PerformanceNavigationTiming'
				);
			}

			return;
		}

		performanceAnalytics.endMeasure(navigationMeasureId, {
			route,
			navigationType: 'navigate'
		});
		navigationMeasureId = null;
	});

	onMount(() => {
		theme.init();

		return () => {
			if (dev) {
				performanceAnalytics.destroy();
			}
		};
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
