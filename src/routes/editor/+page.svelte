<script lang="ts">
	import { dev } from '$app/environment';
</script>

{#if !dev}
	<div class="flex min-h-screen items-center justify-center">
		<p class="text-(--text-muted)">This page is only available in development mode.</p>
	</div>
{/if}
