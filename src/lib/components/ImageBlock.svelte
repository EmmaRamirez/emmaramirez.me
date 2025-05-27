<script lang="ts">
	import type { Snippet } from "svelte";


    interface ImageBlockProps extends svelteHTML.HTMLAttributes<HTMLImageElement> {
        image: string;
        alt: string;
        caption: string;
        className: string;
        imageId?: string;
        children?: Snippet;
    }
    let { image, alt, caption, className, imageId = undefined, children, ...imageProps }: ImageBlockProps = $props();
</script>


<div class="image-block sparkle relative {className}" {...imageProps}>
	<figure class="absolute top-0 left-0">
		<img id={imageId} src={image} {alt} class="rounded-lg" />
		<figcaption>{caption}</figcaption>
	</figure>
    {@render children?.()}
</div>
