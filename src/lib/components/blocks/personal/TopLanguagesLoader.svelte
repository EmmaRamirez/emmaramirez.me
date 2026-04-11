<script lang="ts">
	import { onMount } from 'svelte';
	import {
		type TopLanguage,
		type TopLanguagesResponse
	} from '$lib/github/topLanguages';
	import { trackedFetch } from '$lib/stores/performanceAnalytics.svelte';

	interface Props {
		onload: (languages: TopLanguage[]) => void;
		onerror: () => void;
	}

	let { onload, onerror }: Props = $props();

	onMount(() => {
		const controller = new AbortController();

		void (async () => {
			try {
				const response = await trackedFetch(
					'/api/github/top-languages',
					{
						signal: controller.signal
					},
					{
						label: 'GitHub top languages',
						source: 'TopLanguages'
					}
				);

				if (!response.ok) {
					onerror();
					return;
				}

				const payload = (await response.json()) as TopLanguagesResponse;
				if (payload.languages.length > 0) {
					onload(payload.languages);
					return;
				}

				onerror();
			} catch (error) {
				if (error instanceof DOMException && error.name === 'AbortError') {
					return;
				}

				console.error('Failed to load GitHub top languages:', error);
				onerror();
			}
		})();

		return () => {
			controller.abort();
		};
	});
</script>
