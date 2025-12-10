<script lang="ts">
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";

    interface ArticleBlockProps {
        title: string;
        content: string;
        date?: string;
        tags?: string[];
        width?: 'sm' | 'md' | 'lg';
        class?: string | Snippet;
        titleClass?: string;
        articleId?: string;
        contentClass?: string;
        ontagclick?: (tag: string) => void;
    }

    let { title, content, date, tags = [], width = 'sm', class: className, titleClass, articleId = 'article-block', contentClass, ontagclick }: ArticleBlockProps = $props();

    function handleTagClick(event: MouseEvent, tag: string) {
        event.preventDefault();
        event.stopPropagation();
        ontagclick?.(tag);
    }
</script>

<div class={cn("cursor-pointer article-block bg-[var(--transit-yellow-500)] border border-[var(--liver-brown-500)] rounded-lg flex flex-col relative overflow-hidden", className)} id={articleId}>
    <a class="style-none cursor-pointer block p-4" href="/blog/article">
        <div class={cn("article-block-title text-xl font-bold mb-2 leading-tight", titleClass)}>{title}</div>
        <p class={cn("article-block-content text-[var(--liver-brown-700)] leading-relaxed", contentClass)}>
            {#if typeof content != 'string'}
                {@render content()}
            {:else}
                {content}
            {/if}
        </p>
        
        {#if tags.length > 0 || date}
            <div class="mt-4 pt-3 border-t border-[var(--liver-brown-300)] flex items-center justify-between gap-3">
                {#if tags.length > 0}
                    <div class="flex gap-2 flex-wrap">
                        {#each tags as tag (tag)}
                            <span class="text-xs px-2 py-1 rounded-full bg-[var(--sandy-tan-500)] text-[var(--liver-brown-700)] font-mono uppercase tracking-wider">
                                {tag}
                            </span>
                        {/each}
                    </div>
                {/if}
                {#if date}
                    <time class="text-sm text-[var(--liver-brown-500)] font-mono whitespace-nowrap">
                        {new Date(date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                        })}
                    </time>
                {/if}
            </div>
        {/if}
    </a>
</div>

<style>
    .article-block-content::-webkit-scrollbar {
        display: none;
    }
</style>

