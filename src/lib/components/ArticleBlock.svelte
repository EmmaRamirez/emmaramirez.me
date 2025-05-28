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


    let top = $state(0);

    function slowScroll(content: HTMLElement) {
        
        content.style.overflow = 'auto';
        const height = content?.scrollHeight;

        const interval = setInterval(() => {
            top = top + 20;
            content?.scrollTo({
                top,
                behavior: 'smooth'
            });

            if (top >= height) {
                clearInterval(interval);
            }
        }, 1000);
    }

    function handleMouseOver(e: MouseEvent) {
        const content = document.getElementById('content');

        slowScroll(content);
    }

</script>

<div class={cn("cursor-pointer article-block bg-[var(--transit-yellow-500)] border border-[var(--liver-brown-500)] rounded-lg flex flex-col gap-3 relative z-index-2 hover:scale-105 transition-all duration-300 overflow-hidden", isNavigating && "z-2", className)} id={articleId} on:mouseover={handleMouseOver}>
    <a class="style-none cursor-pointer" href="blog/article">
        <div class="flex items-center justify-between">
            <div class={cn("article-block-title text-xl font-bold pl-4 py-2", titleClass)}>{title}</div>
            <!-- <span class="article-block-content-tag bg-[var(--liver-brown-500)] text-white p-2 uppercase font-mono">Article</span> -->
        </div>
    <p id="content"class={cn("article-block-content bg-[var(--transit-yellow-500)] p-4 py-0 max-h-48 text-ellipsis {widthMap[width]}", contentClass)}>
        {#if typeof content != 'string'}
            {@render content()}
        {:else}
            {content}
        {/if}
    </p>
</a>
</div>

<style>
    .article-block-content::-webkit-scrollbar {
        display: none;
    }
</style>

