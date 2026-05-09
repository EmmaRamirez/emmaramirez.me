<script lang="ts">
	import { goto } from '$app/navigation';
	import { asset, resolve } from '$app/paths';
	import DoricColumnStage from './DoricColumnStage.svelte';

	type Props = {
		mode?: 'tile' | 'page';
	};

	type ViewTransition = {
		finished: Promise<void>;
	};

	type ViewTransitionDocument = Document & {
		startViewTransition?: (updateCallback: () => void | Promise<void>) => ViewTransition;
	};

	let { mode = 'tile' }: Props = $props();

	let tooltipVisible = $state(false);
	let tooltipX = $state(160);
	let tooltipY = $state(160);
	let isOpening = $state(false);

	const articleHref = resolve('/article/redesigning-article');
	const homeHref = resolve('/');
	const textureImage = asset('/article-concrete-texture.png');
	const isPage = $derived(mode === 'page');

	function updateTooltip(event: PointerEvent) {
		tooltipX = event.clientX;
		tooltipY = event.clientY;
		tooltipVisible = true;
	}

	async function openArticle(event: MouseEvent) {
		if (
			isPage ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		) {
			return;
		}

		event.preventDefault();
		if (isOpening) return;

		isOpening = true;

		try {
			const navigate = () => goto(articleHref, { keepFocus: true });
			const startViewTransition = (document as ViewTransitionDocument).startViewTransition;

			await new Promise((done) => setTimeout(done, 140));

			if (startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				await startViewTransition.call(document, navigate).finished;
			} else {
				await navigate();
			}
		} finally {
			isOpening = false;
		}
	}
</script>

{#if isPage}
	<article
		class="redesigning redesigning--page"
		aria-labelledby="redesigning-title"
		style:--texture-image={`url("${textureImage}")`}
	>
		<DoricColumnStage mode="page" />

		<div class="redesigning__page-shell">
			<header class="redesigning__page-header">
				<a class="redesigning__home-link style-none" href={homeHref}>Home</a>
				<p class="redesigning__eyebrow">Article</p>
				<h1 id="redesigning-title">Redesigning This Website, Again</h1>
				<p class="redesigning__dek">
					A route-scoped article concept about starting over, keeping the strange parts, and letting
					the site feel handmade.
				</p>
			</header>

			<div class="redesigning__article-body">
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non nulla quam. Integer
					id sem at sapien fringilla viverra. Donec vitae tellus vel nibh facilisis luctus in non
					enim.
				</p>
				<p>
					Suspendisse potenti. Curabitur tempus, lacus at efficitur posuere, erat metus interdum
					massa, a fermentum mauris est sed justo. Sed porta velit ac ante dictum, vitae congue
					lectus placerat.
				</p>
				<p>
					Aliquam erat volutpat. Maecenas eu lacus sit amet est varius pretium. Duis ornare, sapien
					sed pulvinar cursus, sem mi cursus magna, in pretium arcu ligula at lorem.
				</p>
			</div>
		</div>
	</article>
{:else}
	<article
		class={['redesigning', 'redesigning--tile', isOpening && 'redesigning--opening']}
		aria-labelledby="redesigning-tile-title"
		style:--texture-image={`url("${textureImage}")`}
	>
		<a
			class="redesigning__hitbox style-none"
			href={articleHref}
			aria-label="Read Redesigning This Website, Again"
			onclick={openArticle}
			onpointermove={updateTooltip}
			onpointerenter={updateTooltip}
			onpointerleave={() => (tooltipVisible = false)}
			onfocus={() => (tooltipVisible = true)}
			onblur={() => (tooltipVisible = false)}
		>
			<DoricColumnStage />

			<span class="redesigning__eyebrow">Article</span>
			<h2 id="redesigning-tile-title">Redesigning This Website, Again</h2>
		</a>
	</article>

	<span
		class={['redesigning__tooltip', tooltipVisible && 'redesigning__tooltip--visible']}
		style:--tooltip-x={`${tooltipX}px`}
		style:--tooltip-y={`${tooltipY}px`}
		aria-hidden="true"
	>
		Read Article
	</span>
{/if}

<style>
	.redesigning {
		--paper: hsl(37, 54%, 82%);
		--paper-deep: hsl(35, 44%, 72%);
		--ink: hsl(20, 20%, 18%);
		--ink-muted: hsla(20, 20%, 18%, 0.72);
		--green: hsl(105, 28%, 38%);

		position: relative;
		isolation: isolate;
		min-width: 0;
		overflow: hidden;
		color: var(--ink);
		background:
			radial-gradient(circle at 18% 16%, rgba(188, 142, 46, 0.26), transparent 14rem),
			radial-gradient(circle at 82% 84%, rgba(76, 103, 60, 0.2), transparent 13rem),
			linear-gradient(145deg, hsl(40, 66%, 88%), var(--paper) 48%, var(--paper-deep));
		box-shadow:
			inset 0 0 0 1px rgba(82, 59, 28, 0.16),
			inset 0 0 4rem rgba(89, 59, 19, 0.16),
			0 1rem 2.6rem rgba(58, 39, 17, 0.14);
	}

	.redesigning::before,
	.redesigning::after {
		position: absolute;
		inset: 0;
		content: '';
		pointer-events: none;
	}

	.redesigning::before {
		z-index: 1;
		background:
			var(--texture-image) center / cover,
			linear-gradient(90deg, rgba(255, 255, 255, 0.14), transparent 28%, rgba(60, 40, 15, 0.12));
		filter: contrast(1.18) sepia(0.18);
		mix-blend-mode: multiply;
		opacity: 0.3;
	}

	.redesigning::after {
		z-index: 2;
		border: 1px solid rgba(83, 55, 19, 0.18);
		border-radius: inherit;
		box-shadow: inset 0 0 0 0.35rem rgba(255, 248, 225, 0.16);
	}

	.redesigning--tile {
		min-height: min(14rem, calc(100vw - 2rem));
		border-radius: 1.5rem;
	}

	.redesigning__hitbox {
		position: relative;
		z-index: 3;
		display: grid;
		width: 100%;
		height: 100%;
		min-height: inherit;
		place-items: center;
		grid-template-rows: 1fr auto auto 1fr;
		gap: clamp(0.85rem, 2.4vw, 1.25rem);
		padding: clamp(1.4rem, 4vw, 2.4rem);
		text-align: center;
		text-decoration: none;
		cursor: inherit;
		transition:
			transform 220ms ease,
			filter 220ms ease;
	}

	.redesigning__hitbox:hover,
	.redesigning__hitbox:focus-visible {
		filter: saturate(1.08);
		transform: scale(1.015);
		outline: none;
	}

	.redesigning__hitbox:focus-visible {
		box-shadow: inset 0 0 0 0.2rem rgba(82, 104, 61, 0.42);
	}

	.redesigning--opening .redesigning__hitbox {
		filter: saturate(1.14) brightness(1.03);
		transform: scale(1.035);
	}

	.redesigning__eyebrow {
		position: relative;
		z-index: 4;
		display: inline-grid;
		place-items: center;
		margin: 0;
		color: var(--green);
		font-size: 0.68rem;
		font-weight: 850;
		letter-spacing: 0.26em;
		line-height: 1;
		text-align: center;
		text-transform: uppercase;
	}

	.redesigning--tile .redesigning__eyebrow {
		align-self: end;
		padding: 0.42rem 0.68rem;
		background: rgba(251, 241, 203, 0.58);
		border: 1px solid rgba(83, 55, 19, 0.16);
		border-radius: 999px;
	}

	.redesigning h1,
	.redesigning h2 {
		position: relative;
		z-index: 4;
		max-width: 12ch;
		margin: 0 auto;
		color: var(--ink);
		font-family: 'DM Serif Text', serif;
		font-weight: 400;
		letter-spacing: -0.045em;
		text-wrap: balance;
	}

	.redesigning h2 {
		align-self: center;
		font-size: clamp(2.05rem, 7.6vw, 4.25rem);
		line-height: 0.93;
	}

	.redesigning__tooltip {
		position: fixed;
		z-index: 2147483647;
		top: var(--tooltip-y, 50%);
		left: var(--tooltip-x, 50%);
		padding: 0.45rem 0.68rem;
		color: hsl(42, 59%, 91%);
		font-size: 0.72rem;
		font-weight: 850;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		white-space: nowrap;
		background: hsla(20, 22%, 15%, 0.88);
		border: 1px solid rgba(222, 181, 87, 0.45);
		border-radius: 999px;
		box-shadow: 0 0.8rem 1.8rem rgba(42, 28, 10, 0.22);
		opacity: 0;
		pointer-events: none;
		transform: translate(0.85rem, 0.85rem) scale(0.96);
		transition:
			opacity 120ms ease,
			transform 120ms ease;
	}

	.redesigning__tooltip--visible {
		opacity: 1;
		transform: translate(0.85rem, 0.85rem) scale(1);
	}

	.redesigning--page {
		display: grid;
		min-height: 100vh;
		place-items: center;
		padding: clamp(2rem, 6vw, 5rem) 1rem;
		border-radius: 0;
	}

	.redesigning__page-shell {
		position: relative;
		z-index: 4;
		display: grid;
		width: min(100%, 56rem);
		gap: clamp(2rem, 5vw, 4rem);
		padding: clamp(2rem, 6vw, 5rem);
		background: rgba(250, 237, 198, 0.76);
		border: 1px solid rgba(83, 55, 19, 0.2);
		border-radius: 2rem;
		box-shadow:
			inset 0 0 3rem rgba(91, 61, 20, 0.08),
			0 1.6rem 4rem rgba(49, 33, 12, 0.22);
		backdrop-filter: blur(12px);
	}

	.redesigning__page-header {
		display: grid;
		gap: clamp(0.85rem, 2vw, 1.25rem);
		text-align: center;
	}

	.redesigning__home-link {
		justify-self: center;
		color: var(--green);
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-decoration: none;
		text-transform: uppercase;
	}

	.redesigning h1 {
		max-width: 10ch;
		font-size: clamp(2.75rem, 9vw, 6.75rem);
		line-height: 0.9;
	}

	.redesigning__dek {
		max-width: 40rem;
		margin: 0 auto;
		color: var(--ink-muted);
		font-size: clamp(1.05rem, 2vw, 1.35rem);
		line-height: 1.6;
		text-wrap: balance;
	}

	.redesigning__article-body {
		display: grid;
		max-width: 42rem;
		gap: 1.15rem;
		margin: 0 auto;
		color: hsla(20, 20%, 18%, 0.84);
		font-size: clamp(1rem, 1.6vw, 1.18rem);
		line-height: 1.8;
	}

	.redesigning__article-body p {
		margin: 0;
	}

	@media (min-width: 48rem) {
		.redesigning--tile {
			grid-column: span 3;
			grid-row: span 1;
			min-height: 100%;
		}
	}

	@media (max-width: 42rem) {
		.redesigning h2 {
			font-size: clamp(2.15rem, 12vw, 3.4rem);
		}

		.redesigning__page-shell {
			border-radius: 1.4rem;
		}
	}

	@supports (view-transition-name: none) {
		.redesigning {
			view-transition-name: redesigning-article;
			contain: layout;
		}

		:global(::view-transition-old(redesigning-article)),
		:global(::view-transition-new(redesigning-article)) {
			animation-duration: 720ms;
			animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
			overflow: clip;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.redesigning__hitbox,
		.redesigning__tooltip {
			transition: none;
		}
	}
</style>
