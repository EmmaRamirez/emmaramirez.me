<script lang="ts">
	import Bloblet from './Bloblet.svelte';
	import Bloblet2 from './Bloblet2.svelte';
	import { Blob } from '$lib/types';

	interface BlobProps {
		class?: string;
		fill?: string;
		blob?: Blob;
	}

	let { class: className, fill, blob = Blob.Bloblet2 }: BlobProps = $props();
</script>

{#if blob === Blob.Bloblet}
	<Bloblet class={className} {fill} />
{:else if blob === Blob.Bloblet2}
	<Bloblet2 class={className} {fill} />
{/if}
