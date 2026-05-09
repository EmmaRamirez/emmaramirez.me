<script lang="ts">
	import { ArticleCard } from '$lib/components/blocks';
	import type { ArticleCardData } from '$lib/articles';

	interface Props {
		article: ArticleCardData;
		variant?: 'main' | 'featured';
		active?: boolean;
		onselect?: () => void;
	}

	let { article, variant = 'main', active = false, onselect }: Props = $props();

	const readTime = $derived(
		article.readingTimeMinutes ? `${article.readingTimeMinutes} min read` : undefined
	);
</script>

<ArticleCard
	{variant}
	title={article.title}
	content={article.content}
	date={article.date}
	{active}
	{onselect}
	{readTime}
	tags={article.tags}
/>
