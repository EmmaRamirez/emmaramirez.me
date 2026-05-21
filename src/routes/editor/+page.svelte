<script lang="ts">
	import { dev } from '$app/environment';
	import HomepageBlocksSection from '$lib/components/editor/HomepageBlocksSection.svelte';
</script>

<svelte:head>
	<title>Editor · emzinnia.dev</title>
</svelte:head>

{#if dev}
	<div class="mx-auto max-w-3xl space-y-8 px-4 py-12">
		<header>
			<h1 class="text-3xl font-semibold text-(--text-primary)">Editor</h1>
			<p class="mt-2 text-(--text-secondary)">Dev-only controls for the homepage.</p>
		</header>

		<HomepageBlocksSection />
	</div>
{/if}
