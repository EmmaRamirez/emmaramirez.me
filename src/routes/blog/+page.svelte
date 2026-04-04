<script lang="ts">
	import { headerColor, title } from '$lib/stores';
	import {
		getArticleMetas,
		getAllTags,
		getTagGraph,
		type ArticleMeta,
		type TagGraphLink,
		type TagGraphNode
	} from '$lib/articles';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle } from '$lib/components/ui';
	import { dev } from '$app/environment';
	import { resolve } from '$app/paths';
	import {
		type SimulationLinkDatum,
		type SimulationNodeDatum,
		forceCenter,
		forceCollide,
		forceLink,
		forceManyBody,
		forceSimulation,
		forceX,
		forceY
	} from 'd3-force';
	import { fade, fly } from 'svelte/transition';
	import { formatShortDate } from '$lib/utils';

	type SimulationNode = TagGraphNode & SimulationNodeDatum & {
		x: number;
		y: number;
	};

	type SimulationLink = TagGraphLink &
		SimulationLinkDatum<SimulationNode> & {
		source: string | SimulationNode;
		target: string | SimulationNode;
	};

	type RenderedGraphNode = TagGraphNode & {
		x: number;
		y: number;
	};

	type RenderedGraphLink = TagGraphLink & {
		x1: number;
		y1: number;
		x2: number;
		y2: number;
	};

	title.set('blog');
	headerColor.set('var(--page-bg-subtle)');

	const articles = getArticleMetas();
	const allTags = getAllTags();
	const tagGraph = getTagGraph();

	const articlesByYear = $derived.by(() => {
		const grouped: Record<string, ArticleMeta[]> = {};
		for (const article of articles) {
			const year = article.date ? new Date(article.date).getFullYear().toString() : 'Undated';
			grouped[year] ??= [];
			grouped[year].push(article);
		}
		return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
	});

	let selectedTag = $state<string | null>(null);
	let tagView = $state<'flat' | 'web'>('flat');
	let graphHost = $state<HTMLDivElement | null>(null);
	let graphWidth = $state(0);
	let graphLayout = $state<{ nodes: RenderedGraphNode[]; links: RenderedGraphLink[] }>({
		nodes: [],
		links: []
	});

	const graphHeight = $derived(graphWidth < 520 ? 680 : graphWidth < 720 ? 600 : 540);

	const relatedTagIds = $derived.by(() => {
		const related: string[] = [];
		if (!selectedTag) return related;

		related.push(selectedTag);
		for (const link of tagGraph.links) {
			if (link.source === selectedTag && !related.includes(link.target)) related.push(link.target);
			if (link.target === selectedTag && !related.includes(link.source)) related.push(link.source);
		}

		return related;
	});

	const filteredArticlesByYear = $derived.by(() => {
		if (!selectedTag) return articlesByYear;

		const filtered: Record<string, ArticleMeta[]> = {};
		for (const article of articles) {
			if (article.tags?.includes(selectedTag)) {
				const year = article.date ? new Date(article.date).getFullYear().toString() : 'Undated';
				filtered[year] ??= [];
				filtered[year].push(article);
			}
		}
		return Object.entries(filtered).sort((a, b) => b[0].localeCompare(a[0]));
	});

	function formatDate(dateStr: string | undefined) {
		return formatShortDate(dateStr);
	}

	function clearTagSelection() {
		selectedTag = null;
	}

	function toggleTagSelection(tag: string) {
		selectedTag = selectedTag === tag ? null : tag;
	}

	function clampPosition(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}

	function getClusterTargets(width: number, height: number) {
		const clusterGroups: Record<number, SimulationNode[]> = {};
		for (const node of tagGraph.nodes) {
			(clusterGroups[node.cluster] ??= []).push({
				...node,
				x: width / 2,
				y: height / 2
			});
		}

		const orderedClusters = Object.entries(clusterGroups)
			.map(([clusterId, nodes]) => ({ clusterId: Number(clusterId), size: nodes.length }))
			.sort((left, right) => right.size - left.size || left.clusterId - right.clusterId);

		const centerX = width / 2;
		const centerY = height / 2;
		const targets: Record<number, { x: number; y: number }> = {};
		if (orderedClusters.length === 0) return targets;

		targets[orderedClusters[0].clusterId] = { x: centerX, y: centerY };

		const ringOneRadius = Math.min(width, height) * 0.22;
		const ringTwoRadius = Math.min(width, height) * 0.34;
		const ringOneCapacity = 6;

		for (let index = 1; index < orderedClusters.length; index += 1) {
			const cluster = orderedClusters[index];
			const ringIndex = index - 1;
			const isFirstRing = ringIndex < ringOneCapacity;
			const positionInRing = isFirstRing ? ringIndex : ringIndex - ringOneCapacity;
			const ringSize = isFirstRing
				? Math.min(ringOneCapacity, orderedClusters.length - 1)
				: Math.max(orderedClusters.length - 1 - ringOneCapacity, 1);
			const angleOffset = isFirstRing ? -Math.PI / 2 : -Math.PI / 2 + Math.PI / ringSize;
			const angle = angleOffset + (positionInRing / ringSize) * Math.PI * 2;
			const radius = isFirstRing ? ringOneRadius : ringTwoRadius;

			targets[cluster.clusterId] = {
				x: centerX + Math.cos(angle) * radius,
				y: centerY + Math.sin(angle) * radius
			};
		}

		return targets;
	}

	function createInitialNodes(width: number, height: number): SimulationNode[] {
		const clusterTargets = getClusterTargets(width, height);
		const clusterOffsets: Record<number, number> = {};

		return tagGraph.nodes.map((node) => {
			const target = clusterTargets[node.cluster] ?? { x: width / 2, y: height / 2 };
			const clusterIndex = clusterOffsets[node.cluster] ?? 0;
			clusterOffsets[node.cluster] = clusterIndex + 1;
			const angle = clusterIndex * 1.7;
			const orbit = Math.min(42, 16 + clusterIndex * 7);

			return {
				...node,
				x: target.x + Math.cos(angle) * orbit,
				y: target.y + Math.sin(angle) * orbit
			};
		});
	}

	function resolveSimulationNode(
		nodeRef: string | SimulationNode,
		nodesById: Map<string, SimulationNode>
	): SimulationNode {
		return typeof nodeRef === 'string' ? nodesById.get(nodeRef)! : nodeRef;
	}

	function updateGraphLayout(nodes: SimulationNode[], links: SimulationLink[], width: number, height: number) {
		const nodesById = new Map(nodes.map((node) => [node.id, node]));

		graphLayout = {
			nodes: nodes.map((node) => ({
				...node,
				x: clampPosition(node.x ?? width / 2, node.radius, width - node.radius),
				y: clampPosition(node.y ?? height / 2, node.radius, height - node.radius)
			})),
			links: links.map((link) => {
				const source = resolveSimulationNode(link.source, nodesById);
				const target = resolveSimulationNode(link.target, nodesById);

				return {
					source: source.id,
					target: target.id,
					weight: link.weight,
					x1: clampPosition(source.x ?? width / 2, 0, width),
					y1: clampPosition(source.y ?? height / 2, 0, height),
					x2: clampPosition(target.x ?? width / 2, 0, width),
					y2: clampPosition(target.y ?? height / 2, 0, height)
				};
			})
		};
	}

	$effect(() => {
		if (tagView !== 'web' || !graphHost || graphWidth === 0) return;

		const width = graphWidth;
		const height = graphHeight;
		const clusterTargets = getClusterTargets(width, height);
		const nodes = createInitialNodes(width, height);
		const links: SimulationLink[] = tagGraph.links.map((link) => ({ ...link }));

		const simulation = forceSimulation(nodes)
			.force(
				'link',
				forceLink<SimulationNode, SimulationLink>(links)
					.id((node: SimulationNode) => node.id)
					.distance((link: SimulationLink) => 84 - Math.min(link.weight, 3) * 10)
					.strength((link: SimulationLink) => 0.26 + Math.min(link.weight, 3) * 0.1)
			)
			.force(
				'charge',
				forceManyBody<SimulationNode>().strength((node: SimulationNode) => -(node.radius * 5.5 + 56))
			)
			.force(
				'collide',
				forceCollide<SimulationNode>().radius((node: SimulationNode) => node.radius + 8).iterations(2)
			)
			.force('center', forceCenter(width / 2, height / 2))
			.force(
				'cluster-x',
				forceX<SimulationNode>().x((node) => clusterTargets[node.cluster]?.x ?? width / 2).strength(0.24)
			)
			.force(
				'cluster-y',
				forceY<SimulationNode>().y((node) => clusterTargets[node.cluster]?.y ?? height / 2).strength(0.24)
			)
			.alpha(1);

		simulation.on('tick', () => {
			updateGraphLayout(nodes, links, width, height);
		});

		updateGraphLayout(nodes, links, width, height);

		return () => {
			simulation.stop();
		};
	});
</script>

<svelte:head>
	<title>Blog — Emma Ramirez</title>
	<meta
		name="description"
		content="Essays on design, development, and the craft of building things."
	/>
</svelte:head>

<section class="relative w-full min-h-screen">
	<Header sticky>
		<HeaderLogo>EMZINNIA</HeaderLogo>
		<HeaderNav>
			<HeaderNavItem href="/">Home</HeaderNavItem>
			<HeaderNavItem href="/blog" active class="text-(--text-primary)">Essays</HeaderNavItem>
			<HeaderNavItem href="/about">About</HeaderNavItem>
			{#if dev}
				<HeaderNavItem href="/editor">Editor</HeaderNavItem>
			{/if}
			<a
				href="https://github.com/emzinnia"
				target="_blank"
				rel="noopener noreferrer"
				class="ml-2 flex items-center justify-center rounded-lg p-1.5 text-(--text-primary) transition-colors hover:bg-(--surface-hover) md:ml-4 md:p-2"
				aria-label="GitHub profile"
			>
				<svg class="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
						fill="currentColor"
					/></svg
				>
			</a>
			<ThemeToggle class="ml-2" />
		</HeaderNav>
	</Header>

	<div class="blog-container mx-auto max-w-2xl px-6 py-16">
		<header class="mb-16" in:fade={{ duration: 400 }}>
			<div class="flex items-center gap-3 mb-4">
				<span class="inline-block w-8 h-0.25 bg-(--text-muted)"></span>
				<span class="text-xs uppercase tracking-[0.3em] text-(--text-muted) font-sans"
					>Writing</span
				>
			</div>
			<h1 class="text-4xl md:text-5xl font-serif leading-tight text-(--text-primary) mb-4">
				Essays & Notes
			</h1>
			<p class="text-lg text-(--text-secondary) leading-relaxed max-w-xl">
				Thoughts on design, development, and the quiet craft of building things that work.
			</p>
		</header>

		<nav class="mb-12 pb-6 border-b border-(--border-color)" in:fade={{ duration: 400, delay: 100 }}>
			<div class="mb-6 flex flex-wrap items-center justify-between gap-4">
				<p class="text-xs uppercase tracking-[0.2em] text-(--text-muted) font-sans">
					Browse by tag
				</p>
				<div class="view-toggle" role="group" aria-label="Tag view mode">
					<button
						type="button"
						class={['view-toggle-button', { active: tagView === 'flat' }]}
						aria-pressed={tagView === 'flat'}
						onclick={() => (tagView = 'flat')}
					>
						Flat
					</button>
					<button
						type="button"
						class={['view-toggle-button', { active: tagView === 'web' }]}
						aria-pressed={tagView === 'web'}
						onclick={() => (tagView = 'web')}
					>
						Web
					</button>
				</div>
			</div>

			{#if tagView === 'flat'}
				<div class="flex flex-wrap gap-2">
					<button
						type="button"
						class={['tag-pill', { active: selectedTag === null }]}
						aria-pressed={selectedTag === null}
						onclick={clearTagSelection}
					>
						All
					</button>
					{#each allTags as tag (tag)}
						<button
							type="button"
							class={['tag-pill', { active: selectedTag === tag }]}
							aria-pressed={selectedTag === tag}
							onclick={() => toggleTagSelection(tag)}
						>
							{tag}
						</button>
					{/each}
				</div>
			{:else}
				<div class="tag-web">
					<div class="mb-4 flex flex-wrap gap-2">
						<button
							type="button"
							class={['tag-pill', { active: selectedTag === null }]}
							aria-pressed={selectedTag === null}
							onclick={clearTagSelection}
						>
							All
						</button>
					</div>

					<div class="tag-graph-shell">
						<div
							class="tag-graph"
							bind:this={graphHost}
							bind:clientWidth={graphWidth}
							style={`height: ${graphHeight}px;`}
						>
							<svg
								class="tag-graph-links"
								viewBox={`0 0 ${Math.max(graphWidth, 1)} ${graphHeight}`}
								aria-hidden="true"
							>
								{#each graphLayout.links as link (`${link.source}-${link.target}`)}
									<line
										x1={link.x1}
										y1={link.y1}
										x2={link.x2}
										y2={link.y2}
										stroke-width={1 + link.weight * 0.5}
										class={[
											'tag-edge',
											{
												active:
													selectedTag !== null &&
													(link.source === selectedTag || link.target === selectedTag)
											}
										]}
									/>
								{/each}
							</svg>

							{#each graphLayout.nodes as node (node.id)}
								<button
									type="button"
									class={[
										'tag-node',
										{
											active: selectedTag === node.id,
											related: selectedTag !== null && relatedTagIds.includes(node.id),
											dimmed: selectedTag !== null && !relatedTagIds.includes(node.id)
										}
									]}
									style={`left: ${node.x}px; top: ${node.y}px; min-width: ${Math.max(node.radius * 1.45, 64)}px;`}
									aria-pressed={selectedTag === node.id}
									onclick={() => toggleTagSelection(node.id)}
								>
									{node.label}
								</button>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</nav>

		<div class="space-y-12">
			{#each filteredArticlesByYear as [year, yearArticles], yearIndex (year)}
				<section class="year-section" in:fly={{ y: 20, duration: 400, delay: 150 + yearIndex * 50 }}>
					<div class="flex items-center gap-4 mb-6">
						<h2 class="text-sm font-mono text-(--text-muted) tabular-nums">{year}</h2>
						<span class="flex-1 h-0.25 bg-(--border-color) opacity-50"></span>
					</div>

					<ul class="space-y-1">
						{#each yearArticles as article (article.slug)}
							<li>
								<a
									href={resolve('/blog/[slug]', { slug: article.slug })}
									class="article-row style-none group flex items-baseline justify-between gap-4 py-3 border-b border-(--border-color) border-opacity-30 hover:border-opacity-100 transition-all"
								>
									<div class="flex-1 min-w-0">
										<span
											class="article-title text-base text-(--text-primary) group-hover:text-(--link-hover) transition-colors"
										>
											{article.title}
										</span>
										{#if article.tags && article.tags.length > 0}
											<span class="hidden sm:inline-flex gap-1.5 ml-3">
												{#each article.tags.slice(0, 2) as tag (tag)}
													<span
														class="text-[0.625rem] uppercase tracking-wider text-(--text-muted) font-sans"
													>
														{tag}
													</span>
												{/each}
											</span>
										{/if}
									</div>
									<time
										class="text-sm font-mono text-(--text-muted) tabular-nums whitespace-nowrap"
									>
										{formatDate(article.date)}
									</time>
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>

		<footer class="mt-20 pt-8 border-t border-(--border-color) text-center">
			<p class="text-sm text-(--text-muted) italic">
				{articles.length} essays and counting
			</p>
		</footer>
	</div>
</section>

<style>
	.view-toggle {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem;
		border: 0.0625rem solid var(--border-color);
		border-radius: 624.9375rem;
		background: var(--page-bg-subtle);
	}

	.view-toggle-button {
		padding: 0.375rem 0.9rem;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		border-radius: 624.9375rem;
		border: none;
		background: transparent;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.view-toggle-button:hover {
		color: var(--text-primary);
	}

	.view-toggle-button.active {
		background: var(--text-primary);
		color: var(--page-bg);
	}

	.tag-pill {
		padding: 0.375rem 0.75rem;
		font-size: 0.75rem;
		text-transform: lowercase;
		letter-spacing: 0.05em;
		border-radius: 624.9375rem;
		border: 0.0625rem solid var(--border-color);
		background: transparent;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tag-pill:hover {
		background: var(--page-bg-subtle);
		border-color: var(--text-muted);
	}

	.tag-pill.active {
		background: var(--text-primary);
		color: var(--page-bg);
		border-color: var(--text-primary);
	}

	.tag-web {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.tag-graph-shell {
		padding: 1rem;
		border: 0.0625rem solid color-mix(in srgb, var(--border-color) 85%, transparent);
		border-radius: 1.75rem;
		background:
			radial-gradient(circle at top, color-mix(in srgb, var(--page-bg-subtle) 88%, white 12%), transparent 55%),
			linear-gradient(180deg, color-mix(in srgb, var(--page-bg-subtle) 95%, white 5%), transparent);
	}

	.tag-graph {
		position: relative;
		overflow: hidden;
		border-radius: 1.25rem;
		background:
			radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--page-bg-subtle) 92%, white 8%), transparent 45%),
			color-mix(in srgb, var(--page-bg) 82%, var(--page-bg-subtle) 18%);
	}

	.tag-graph-links {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.tag-edge {
		stroke: color-mix(in srgb, var(--border-color) 80%, transparent);
		opacity: 0.38;
		transition: opacity 0.2s ease, stroke 0.2s ease;
	}

	.tag-edge.active {
		stroke: color-mix(in srgb, var(--text-primary) 70%, var(--link-hover) 30%);
		opacity: 0.9;
	}

	.tag-node {
		position: absolute;
		transform: translate(-50%, -50%);
		padding: 0.58rem 0.82rem;
		border-radius: 624.9375rem;
		border: 0.0625rem solid color-mix(in srgb, var(--border-color) 88%, white 12%);
		background: color-mix(in srgb, var(--page-bg-subtle) 92%, transparent);
		color: var(--text-secondary);
		font-size: 0.8rem;
		line-height: 1;
		text-transform: lowercase;
		letter-spacing: 0.03em;
		box-shadow: 0 0 0 0.0625rem color-mix(in srgb, var(--page-bg) 80%, transparent);
		cursor: pointer;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			background 0.2s ease,
			color 0.2s ease,
			opacity 0.2s ease;
	}

	.tag-node:hover {
		transform: translate(-50%, -50%) scale(1.03);
		border-color: color-mix(in srgb, var(--text-muted) 72%, white 28%);
		color: var(--text-primary);
	}

	.tag-node.related {
		border-color: color-mix(in srgb, var(--text-muted) 62%, white 38%);
		color: var(--text-primary);
	}

	.tag-node.dimmed {
		opacity: 0.4;
	}

	.tag-node.active {
		background: var(--text-primary);
		border-color: var(--text-primary);
		color: var(--page-bg);
		box-shadow:
			0 0 0 0.125rem color-mix(in srgb, var(--link-hover) 25%, transparent),
			0 0.375rem 1.5rem color-mix(in srgb, var(--link-hover) 18%, transparent);
	}

	@media (max-width: 42rem) {
		.tag-graph-shell {
			padding: 0.75rem;
		}

		.tag-node {
			font-size: 0.75rem;
			padding: 0.5rem 0.72rem;
		}
	}

	.article-row:last-child {
		border-bottom: none;
	}

	.article-title {
		font-family: 'Source Serif 4', serif;
		font-weight: 500;
	}

	/* Subtle hover effect */
	.article-row::before {
		content: '';
		position: absolute;
		left: -1rem;
		width: 0.1875rem;
		height: 0;
		background: var(--text-primary);
		opacity: 0;
		transition: all 0.2s ease;
	}

	.article-row {
		position: relative;
	}

	.article-row:hover::before {
		height: 100%;
		opacity: 1;
	}
</style>
