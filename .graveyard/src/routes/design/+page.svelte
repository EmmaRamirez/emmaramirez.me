<script lang="ts">
	import DesignComponentGallery from '$lib/components/design/DesignComponentGallery.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Design System | EMZINNIA</title>
	<meta
		name="description"
		content="A complete index of every Svelte component in the EMZINNIA site."
	/>
</svelte:head>

<div class="design-page">
	<DesignComponentGallery repoRoot={data.repoRoot} />
</div>

<style>
	.design-page {
		position: relative;
		min-height: 100vh;
		padding: 0;
		background:
			radial-gradient(ellipse at 0% 0%, #1a1c33 0%, transparent 55%),
			linear-gradient(180deg, #0c0d1c 0%, #0d0e1f 60%, #0a0b1a 100%);
		color: #e9eaff;
		font-family: var(--font-sans);
	}

	.design-page :global(.design-wall) {
		min-height: 100vh;
		border-radius: 0;
	}
</style>
