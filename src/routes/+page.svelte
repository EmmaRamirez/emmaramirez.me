<script lang="ts">
	import SiteCanvas from '$lib/components/SiteCanvas.svelte';
	import DiscoBlock from '$lib/components/DiscoBlock.svelte';
	import Articles from '$lib/components/Articles.svelte';
	import ProjectBlock from '$lib/components/ProjectBlock.svelte';
	import discoImage from '$lib/images/photos/disco.jpeg';
	import fakemonImage from '$lib/images/fakemon-generator.png';
	import nuzlockeImage from '$lib/images/nuzlocke-generator.jpg';
	import profileImage from '$lib/images/profile-2.png';
	import houstonImage from '$lib/images/photos/houston.jpeg';
	import svelteWelcomeImage from '$lib/images/svelte-welcome.webp';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';

	type TileId = 'articles' | 'disco' | 'projects';

	interface Tile {
		id: TileId;
	}

	function seededShuffle<T>(items: T[], seed: number): T[] {
		const result = items.slice();

		// Simple LCG-based pseudo-random generator so layout is
		// random-looking but deterministic across reloads
		const m = 0x80000000;
		const a = 1103515245;
		const c = 12345;

		let state = seed;

		function random() {
			state = (a * state + c) % m;
			return state / (m - 1);
		}

		for (let i = result.length - 1; i > 0; i -= 1) {
			const j = Math.floor(random() * (i + 1));
			[result[i], result[j]] = [result[j], result[i]];
		}

		return result;
	}

	const tiles: Tile[] = [
		{ id: 'articles' },
		{ id: 'disco' },
		{ id: 'projects' }
	];

	const shuffledTiles = seededShuffle(tiles, 42);
</script>

<section class="relative w-screen min-h-screen">
	<Header sticky>
		<HeaderLogo>EMZINNIA</HeaderLogo>
		<HeaderNav>
			<HeaderNavItem href="/" active>Home</HeaderNavItem>
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
				<span class="tracking-[0.35em]">EM</span>
				<span class="block h-[0.08em] w-full bg-current my-[0.15em]"></span>
				<span class="tracking-[0.35em]">MA</span>
			</span>
			<span>. This is my website.</span>
		</h1>
	</div>

	<div class="content-grid max-w-6xl mx-auto px-4 py-8 mt-16">
		<div class="grid gap-8 lg:grid-cols-3 auto-rows-min">
			{#each shuffledTiles as tile (tile.id)}
				{#if tile.id === 'articles'}
					<div class="lg:col-span-2">
						<Articles class="w-full" />
					</div>
				{:else if tile.id === 'disco'}
					<aside class="lg:col-span-1">
						<DiscoBlock
							image={discoImage}
							alt="Disco photo"
							caption="Disco vibes"
							class="w-full h-full"
						/>
					</aside>
				{:else if tile.id === 'projects'}
					<section
						class="projects-section lg:col-span-3 border-t border-[var(--liver-brown-200)] bg-[var(--light-rose-500)]/40"
					>
						<div class="py-12 space-y-8">
							<header
								class="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
							>
								<div>
									<h2
										class="text-3xl font-bold text-[var(--liver-brown-700)] font-serif tracking-tight"
									>
										Projects
									</h2>
									<p class="text-[var(--liver-brown-500)] mt-1 text-lg opacity-80">
										Selected experiments, tools, and side quests.
									</p>
								</div>
							</header>

							<div class="grid gap-6 md:grid-cols-2">
								<ProjectBlock
									title="Fakemon Generator"
									pill="Creative coding"
									image={fakemonImage}
									class="md:col-span-1"
									contentClassName="md:flex-row md:items-center"
									imageClassName="md:translate-x-0 md:ml-4"
								>
									{#snippet description()}
										A playful generator for imaginary Pokémon-style creatures, blending
										design systems, randomness, and cozy UI details.
									{/snippet}
								</ProjectBlock>

								<ProjectBlock
									title="Nuzlocke Tracker"
									pill="UX for constraints"
									image={nuzlockeImage}
									class="md:col-span-1"
									contentClassName="md:flex-row md:items-center"
									imageClassName="md:translate-x-0 md:ml-4"
								>
									{#snippet description()}
										A companion app for challenge runs that keeps teams, routes, and tense
										decisions tidy without losing the charm of notebooks and scribbles.
									{/snippet}
								</ProjectBlock>

								<ProjectBlock
									title="This Personal Site"
									pill="Design systems"
									image={profileImage}
									class="md:col-span-1"
									contentClassName="md:flex-row md:items-center"
									imageClassName="md:translate-x-0 md:ml-4"
								>
									{#snippet description()}
										The hand-rolled design system and SvelteKit setup that powers this very
										site, experimenting with typography, tokens, and a slightly feral layout
										grid.
									{/snippet}
								</ProjectBlock>

								<ProjectBlock
									title="Disco Canvas"
									pill="Playful interfaces"
									image={houstonImage}
									class="md:col-span-1"
									contentClassName="md:flex-row md:items-center"
									imageClassName="md:translate-x-0 md:ml-4"
								>
									{#snippet description()}
										An interactive playground for gradients, blobs, and motion—built to feel
										like a disco floor you can doodle on.
									{/snippet}
								</ProjectBlock>

								<ProjectBlock
									title="Paraglide Playground"
									pill="i18n & UX"
									image={svelteWelcomeImage}
									class="md:col-span-1"
									contentClassName="md:flex-row md:items-center"
									imageClassName="md:translate-x-0 md:ml-4"
								>
									{#snippet description()}
										A multilingual SvelteKit demo using Paraglide that stress-tests copy,
										layout, and tone across languages without turning the UI into a
										spreadsheet.
									{/snippet}
								</ProjectBlock>
							</div>
						</div>
					</section>
				{/if}
			{/each}
		</div>
	</div>
</section>