<script lang="ts">
	import type { Snippet } from "svelte";

    interface ImageBlockProps extends svelteHTML.HTMLAttributes<HTMLImageElement> {
        image: string;
        alt: string;
        caption?: string;
        class: string;
        imageId?: string;
        children?: Snippet;
    }
    let { image, alt, caption, class: className, imageId = undefined, children, ...imageProps }: ImageBlockProps = $props();
</script>


<div class="image-block sparkle relative {className}" {...imageProps}>
	<figure class="relative w-full aspect-4/3">
		<img id={imageId} src={image} {alt} class="absolute inset-0 rounded-lg h-full w-full object-cover" />
		{#if caption}
            <figcaption class="absolute bottom-3 left-0 right-0 uppercase text-xl text-white text-center font-bold drop-shadow-lg z-10">{caption}</figcaption>
        {/if}
	</figure>
    {@render children?.()}
</div>
