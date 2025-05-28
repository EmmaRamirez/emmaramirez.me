<script lang="ts">
	import { beforeNavigate, onNavigate } from "$app/navigation";
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";

    interface ArticleBlockProps {
        title: string;
        content: string;
        width?: 'sm' | 'md' | 'lg';
        class?: string | Snippet;
        titleClass?: string;
        articleId?: string;
        contentClass?: string;
    }

    let { title, content, width = 'sm', class: className, titleClass, articleId = 'article-block', contentClass }: ArticleBlockProps = $props();

    let isNavigating = $state(false);

    const widthMap = {
        'sm': 'max-w-48',
        'md': 'max-w-96',
        'lg': 'max-w-full'
    }

    beforeNavigate((event) => {
        document.body.style.backgroundColor = 'var(--transit-yellow-500)';

        const blocks = document.querySelectorAll('section > *');
        Array.from(blocks).forEach((block) => {
            if (block.id === articleId) {
                console.log('article block detected');
                return;
            } else {
                block.style.transition = 'opacity 0.5s ease-in-out';
                block.style.opacity = '0';
                block.style.pointerEvents = 'none';
            }
        });

        isNavigating = true;
    });

    function delayNavigation() {
        return new Promise((res) => setTimeout(res, 500));
    }

    onNavigate((navigation) => {
        return delayNavigation();
    });

</script>

<div class={cn("cursor-pointer article-block flex flex-col gap-3 relative z-index-2 hover:scale-105 transition-all duration-300", isNavigating && "z-2", className)} id={articleId}>
    <a class="style-none cursor-pointer" href="blog/article">
    <div class={cn("article-block-title text-base font-bold", titleClass)}>{title}</div>
    <p class={cn("article-block-content bg-[var(--transit-yellow-500)] border border-[var(--liver-brown-500)] rounded-lg p-4 max-h-48 overflow-hidden text-ellipsis {widthMap[width]}", contentClass)}>
        {#if typeof content != 'string'}
            {@render content()}
        {:else}
            {content}
        {/if}
    </p>
</a>
</div>

