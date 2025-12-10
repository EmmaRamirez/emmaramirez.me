<script lang="ts">
	import DiscoBlock from '$lib/components/DiscoBlock.svelte';
	import ArticleBlock from '$lib/components/ArticleBlock.svelte';
	import ProjectBlock from '$lib/components/ProjectBlock.svelte';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import {
		type Item,
		getHomepageItems,
		itemKey,
		getProject,
		getArticle,
		getDisco
	} from '$lib/registry/homepage';

	const shuffledItems = getHomepageItems();
</script>

<section class="relative w-screen min-h-screen">
	<Header sticky>
		<HeaderLogo>EMZINNIA</HeaderLogo>
		<HeaderNav>
			<HeaderNavItem href="/" active class="text-black">Home</HeaderNavItem>
			<HeaderNavItem href="/about">About</HeaderNavItem>
			<HeaderNavItem href="/canvas">Canvas</HeaderNavItem>
		</HeaderNav>
	</Header>

	<div class="flex justify-center items-center py-14 px-4">
		<h1
			class="text-5xl font-sans font-bold text-center uppercase flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
		>
			<span>Hi my name's</span>
			<span
				class="inline-flex flex-col items-center justify-center leading-none mx-2 align-middle"
			>
				<span class="tracking-[0.35em] w-full text-balance font-bold">EM</span>
				<span class="block h-[1rem] w-full bg-current my-[0.15em]"></span>
				<span class="tracking-[0.35em] w-full text-balance font-bold">MA</span>
			</span>
			<span>. This is my website.</span>
		</h1>
	</div>

	<div class="content-grid max-w-6xl mx-auto px-4 py-8 mt-16">
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 auto-rows-min">
			{#each shuffledItems as item (itemKey(item))}
				{#if item.kind === 'article'}
					{@const article = getArticle(item.article.id)}
					{#if article}
						<ArticleBlock
							title={article.title}
							content={article.content}
							date={article.date}
							tags={article.tags}
							width="lg"
							articleId={article.id}
							class="h-full hover:border-[var(--liver-brown-700)] hover:shadow-md"
							contentClass="line-clamp-4"
						/>
					{/if}
				{:else if item.kind === 'project'}
					{@const project = getProject(item.id)}
					{#if project}
						<ProjectBlock
							title={project.title}
							pill={project.pill}
							image={project.image}
							class={project.class}
							contentClassName={project.contentClassName}
							imageClassName={project.imageClassName}
						>
							{#snippet description()}
								{project.description}
							{/snippet}
						</ProjectBlock>
					{/if}
				{:else if item.kind === 'disco'}
					{@const disco = getDisco()}
					<DiscoBlock
						image={disco.image}
						alt={disco.alt}
						caption={disco.caption}
						class={disco.class ?? 'w-full h-full'}
					/>
				{/if}
			{/each}
		</div>
	</div>
</section>