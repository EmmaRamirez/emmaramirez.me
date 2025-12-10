<script lang="ts">
	import { cn } from '$lib/utils';
	import ArticleBlock from './ArticleBlock.svelte';
	import TagDrawer from './TagDrawer.svelte';
	import type { Article } from '$lib/articles';
	import { defaultArticles } from '$lib/articles';

	interface ArticlesProps {
		articles?: Article[];
		class?: string;
	}

	let { articles = [], class: className }: ArticlesProps = $props();

	let drawerOpen = $state(false);
	let selectedTag = $state('');

	function handleTagClick(tag: string) {
		selectedTag = tag;
		drawerOpen = true;
	}

	function closeDrawer() {
		drawerOpen = false;
	}

	const displayArticles = $derived(articles.length > 0 ? articles : defaultArticles);
</script>

<div class={cn("articles-container", className)}>
	<header class="articles-header mb-6">
		<h2 class="text-3xl font-bold text-[var(--liver-brown-700)] font-serif tracking-tight">
			Articles
		</h2>
		<p class="text-[var(--liver-brown-500)] mt-1 text-lg opacity-80">
			Thoughts, explorations, and musings
		</p>
	</header>

	<div class="articles-grid grid gap-6 md:grid-cols-2">
		{#each displayArticles as article (article.id)}
			<ArticleBlock
				title={article.title}
				content={article.content}
				date={article.date}
				tags={article.tags}
				width="lg"
				articleId={article.id}
				class="h-full hover:border-[var(--liver-brown-700)] hover:shadow-md"
				contentClass="line-clamp-4"
				ontagclick={handleTagClick}
			/>
		{/each}
	</div>

	<TagDrawer open={drawerOpen} tag={selectedTag} onclose={closeDrawer} />

	{#if displayArticles.length === 0}
		<div class="empty-state text-center py-12 text-[var(--liver-brown-500)]">
			<p class="text-xl">No articles yet.</p>
			<p class="text-sm opacity-70 mt-2">Check back soon for new content.</p>
		</div>
	{/if}
</div>

<style>
	.articles-container {
		padding: 1rem;
	}

	.line-clamp-4 {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>

