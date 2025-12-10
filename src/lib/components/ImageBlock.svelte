<script lang="ts">
	import type { Snippet } from "svelte";
	import type { SvelteHTMLElements } from "svelte/elements";

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
	<figure class="absolute top-0 left-0 h-full w-full">
		<img id={imageId} src={image} {alt} class="rounded-lg h-full w-full object-cover" />
		{#if caption}
            <figcaption class="uppercase text-xl text-gray-500 text-center font-bold">{caption}</figcaption>
        {/if}
	</figure>
    {@render children?.()}
</div>
