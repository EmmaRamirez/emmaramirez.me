<script lang="ts">
	import { cn, formatRelativeDate } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface ArticleBlockProps {
		title: string;
		content: string | Snippet;
		date?: string;
		tags?: string[];
		width?: 'sm' | 'md' | 'lg';
		class?: string;
		titleClass?: string;
		articleId?: string;
		contentClass?: string;
		ontagclick?: (tag: string) => void;
	}

	let {
		title,
		content,
		date,
		tags = [],
		width = 'sm',
		class: className,
		titleClass,
		articleId = 'article-block',
		contentClass,
		ontagclick
	}: ArticleBlockProps = $props();

	function handleTagClick(event: MouseEvent, tag: string) {
		event.preventDefault();
		event.stopPropagation();
		ontagclick?.(tag);
	}
</script>

<div
	class={cn(
		'article-block relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-[var(--liver-brown-500)] bg-[var(--transit-yellow-500)]',
		className
	)}
	id={articleId}
>
	<a class="style-none block cursor-pointer p-4" href="/blog/article">
		<div class={cn('article-block-title mb-2 text-xl leading-tight font-bold', titleClass)}>
			{title}
		</div>
		<p
			class={cn(
				'article-block-content leading-relaxed text-[var(--liver-brown-700)]',
				contentClass
			)}
		>
			{#if typeof content != 'string'}
				{@render content()}
			{:else}
				{content}
			{/if}
		</p>

		{#if tags.length > 0 || date}
			<div
				class="mt-4 flex items-center justify-between gap-3 border-t border-[var(--liver-brown-300)] pt-3"
			>
				{#if tags.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each tags as tag (tag)}
							<button
								type="button"
								class="cursor-pointer rounded-full bg-[var(--sandy-tan-500)] px-2 py-1 font-mono text-xs tracking-wider text-[var(--liver-brown-700)] uppercase transition-colors hover:bg-[var(--liver-brown-500)] hover:text-[var(--sandy-tan-100)]"
								onclick={(e) => handleTagClick(e, tag)}
							>
								{tag}
							</button>
						{/each}
					</div>
				{/if}
				{#if date}
					<time class="font-mono text-sm whitespace-nowrap text-[var(--liver-brown-500)]">
						{formatRelativeDate(date)}
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
