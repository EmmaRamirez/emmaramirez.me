<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ImageBlockProps extends svelteHTML.HTMLAttributes<HTMLImageElement> {
		image: string;
		alt: string;
		caption?: string;
		class: string;
		imageId?: string;
		children?: Snippet;
	}
	let {
		image,
		alt,
		caption,
		class: className,
		imageId = undefined,
		children,
		...imageProps
	}: ImageBlockProps = $props();
</script>

<div class="image-block sparkle relative {className}" {...imageProps}>
	<figure class="relative aspect-4/3 w-full">
		<img
			id={imageId}
			src={image}
			{alt}
			class="absolute inset-0 h-full w-full rounded-lg object-cover"
		/>
		{#if caption}
			<figcaption
				class="absolute right-0 bottom-3 left-0 z-10 text-center text-xl font-bold text-white uppercase drop-shadow-lg"
			>
				{caption}
			</figcaption>
		{/if}
	</figure>
	{@render children?.()}
</div>
