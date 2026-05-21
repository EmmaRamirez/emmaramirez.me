<script lang="ts">
	import { dev } from '$app/environment';
</script>

<svelte:head>
	<title>Editor · emzinnia.dev</title>
</svelte:head>

{#if dev}
	<div class="mx-auto max-w-3xl px-4 py-12">
		<h1 class="text-3xl font-semibold text-(--text-primary)">Editor</h1>
	</div>
{/if}
