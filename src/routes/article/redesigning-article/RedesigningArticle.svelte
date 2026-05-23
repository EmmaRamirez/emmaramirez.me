<script lang="ts">
	import { goto } from '$app/navigation';
	import { asset, resolve } from '$app/paths';
	import StaticDoricColumn from '$lib/components/art/StaticDoricColumn.svelte';
	import oliveBranch from '$lib/images/photos/olive-branch.png';
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
		<div class="redesigning__page-column redesigning__page-column--left" aria-hidden="true">
			<div class="redesigning__page-column-art">
				<StaticDoricColumn side="left" variant="page" />
			</div>
			<DoricColumnStage mode="page" side="left" />
		</div>
		<div class="redesigning__page-column redesigning__page-column--right" aria-hidden="true">
			<div class="redesigning__page-column-art">
				<StaticDoricColumn side="right" variant="page" />
			</div>
			<DoricColumnStage mode="page" side="right" />
		</div>

		<div class="redesigning__page-shell">
			<img
				class="redesigning__olive redesigning__olive--page-top"
				src={oliveBranch}
				alt=""
				aria-hidden="true"
			/>
			<img
				class="redesigning__olive redesigning__olive--page-bottom"
				src={oliveBranch}
				alt=""
				aria-hidden="true"
			/>

			<header class="redesigning__page-header">
				<h1 id="redesigning-title">Redesigning This Website, Again</h1>
				<p class="redesigning__dek">
					I have an actual problem.
				</p>
			</header>

			<div class="redesigning__article-body">
				<p>
					Redesigning things is fun. It's basically the easiest way to achieve literally nothing while feeling amazing about it.
				</p>
				<p>
					I've been redesiging my personal website since December. AI has given my ADHD too much power, honestly. I redesigned it dozens of times, I tweaked every thing every day for an eternity.
				</p>
				<p>
					The most previous iteration of this website was a much more simplistic list of articles. I actually wrote stuff back then. It was all a custom rolled microframework that rendered all sorts of markdown and configuration files. I honestly didn't hate it. I feel like rolling your own framework is the kind of trite, eternal toiling they speak of in the The Old Testament.
				</p>
				<p>
					This site is Sveltekit and some threejs. I will probably have to defend my usage of standard CSS. I think it's good. I'd pick tailwind for a team of 2 or more, but enough of the modern css features are ergonomically annoying to express that I'd rather use css here. I think the problem is that once you're writing css, everything can get really fragmented and deliver bloat.
				</p>
				<p>
					Anywho, this website should feel like I have too many ideas. I think that's both a weapon and a liability in the age of AI. Restraint is a virtue. At the same time, I think we are entering an era of fun. We need to evolve past the sick stagnation of the corporate Memphis era. I think we got to be more destined than that.
				</p>
				<p>
					I kind of think some people will hate the AI generated art on here. A lot of it is my own art, or art I fed into AI and mangled to my heart's content. I kind of like the give and take here, I think it's a central thesis in some way to how I wanted to make this website.
				</p>
				<p>
					
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
			<div class="redesigning__card">
				<div class="redesigning__stage redesigning__stage--left" aria-hidden="true">
					<StaticDoricColumn side="left" />
				</div>
				<div class="redesigning__tile-copy">
					<h2 id="redesigning-tile-title">Redesigning This Website, Again</h2>
				</div>
				<div class="redesigning__stage redesigning__stage--right" aria-hidden="true">
					<StaticDoricColumn side="right" />
				</div>
			</div>

			<img
				class="redesigning__olive redesigning__olive--top"
				src={oliveBranch}
				alt=""
				aria-hidden="true"
			/>
			<img
				class="redesigning__olive redesigning__olive--bottom"
				src={oliveBranch}
				alt=""
				aria-hidden="true"
			/>
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
		align-self: center;
		height: clamp(14rem, 22vw, 15.625rem);
		min-height: 0;
		border-radius: 1.5rem;
		background: none;
		box-shadow: none;
		overflow: visible;
		z-index: 6;
	}

	.redesigning--tile::before,
	.redesigning--tile::after {
		content: none;
	}

	.redesigning__hitbox {
		position: relative;
		z-index: 3;
		display: block;
		width: 100%;
		height: 100%;
		border-radius: inherit;
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
		outline: none;
	}

	.redesigning--opening .redesigning__hitbox {
		filter: saturate(1.14) brightness(1.03);
		transform: scale(1.035);
	}

	.redesigning__card {
		--redesigning-card-shadow:
			inset 0 0 0 1px rgba(82, 59, 28, 0.16), inset 0 0 4rem rgba(89, 59, 19, 0.16),
			0 1rem 2.6rem rgba(58, 39, 17, 0.14);

		position: relative;
		display: grid;
		grid-template-columns:
			minmax(clamp(5rem, 18vw, 7rem), 0.72fr) minmax(0, 1.8fr)
			minmax(clamp(5rem, 18vw, 7rem), 0.72fr);
		grid-template-rows: repeat(1, minmax(0, 1fr));
		width: 100%;
		height: 100%;
		place-items: center;
		overflow: hidden;
		padding-block: clamp(1rem, 2.6vw, 1.55rem);
		padding-inline: clamp(0.8rem, 2vw, 1.3rem);
		background:
			radial-gradient(circle at 18% 16%, rgba(188, 142, 46, 0.26), transparent 14rem),
			radial-gradient(circle at 82% 84%, rgba(76, 103, 60, 0.2), transparent 13rem),
			linear-gradient(145deg, hsl(40, 66%, 88%), var(--paper) 48%, var(--paper-deep));
		border-radius: inherit;
		box-shadow: var(--redesigning-card-shadow);
	}

	.redesigning__card::before,
	.redesigning__card::after {
		position: absolute;
		inset: 0;
		content: '';
		pointer-events: none;
	}

	.redesigning__card::before {
		z-index: 1;
		background:
			var(--texture-image) center / cover,
			linear-gradient(90deg, rgba(255, 255, 255, 0.14), transparent 28%, rgba(60, 40, 15, 0.12));
		filter: contrast(1.18) sepia(0.18);
		mix-blend-mode: multiply;
		opacity: 0.3;
	}

	.redesigning__card::after {
		z-index: 4;
		border: 1px solid rgba(83, 55, 19, 0.18);
		border-radius: inherit;
		box-shadow: inset 0 0 0 0.35rem rgba(255, 248, 225, 0.16);
	}

	.redesigning__hitbox:focus-visible .redesigning__card {
		box-shadow:
			var(--redesigning-card-shadow),
			inset 0 0 0 0.2rem rgba(82, 104, 61, 0.42);
	}

	.redesigning__stage {
		position: relative;
		z-index: 2;
		width: 100%;
		height: 100%;
		min-height: 100%;
		min-width: 0;
		align-self: stretch;
		justify-self: stretch;
		overflow: hidden;
		pointer-events: none;
		filter: drop-shadow(0 1.1rem 1.3rem rgba(52, 34, 12, 0.18));
		transform: scale(1);
		transition: transform 220ms ease;
	}

	.redesigning__hitbox:hover .redesigning__stage,
	.redesigning__hitbox:focus-visible .redesigning__stage {
		transform: scale(1.045);
	}

	.redesigning__stage--left {
		grid-column: 1;
		grid-row: 1;
	}

	.redesigning__stage--right {
		grid-column: 3;
		grid-row: 1;
	}

	.redesigning__olive {
		position: absolute;
		z-index: 8;
		width: clamp(7rem, 20vw, 10.2rem);
		pointer-events: none;
		user-select: none;
		opacity: 0.9;
		filter: saturate(0.78) contrast(1.05);
		mix-blend-mode: multiply;
		transition: transform 220ms ease;
	}

	.redesigning__olive--top {
		top: clamp(-2.4rem, -2vw, -1.3rem);
		left: clamp(0.6rem, 2.8vw, 1.8rem);
		transform: rotate(-12deg);
		transform-origin: 20% 40%;
	}

	.redesigning__hitbox:hover .redesigning__olive--top,
	.redesigning__hitbox:focus-visible .redesigning__olive--top {
		transform: rotate(-12deg) scale(1.08);
	}

	.redesigning__olive--bottom {
		right: clamp(0.6rem, 2.9vw, 1.8rem);
		bottom: clamp(-2.35rem, -1.8vw, -1.2rem);
		transform: scaleX(-1) rotate(-10deg);
		transform-origin: 78% 60%;
	}

	.redesigning__hitbox:hover .redesigning__olive--bottom,
	.redesigning__hitbox:focus-visible .redesigning__olive--bottom {
		transform: scaleX(-1) rotate(-10deg) scale(1.08);
	}

	.redesigning__tile-copy {
		position: relative;
		z-index: 5;
		grid-column: 2;
		grid-row: 1;
		display: grid;
		width: min(100%, 31.25rem);
		gap: clamp(0.7rem, 1.8vw, 1rem);
		place-items: center;
		align-self: center;
		justify-self: center;
	}

	.redesigning h1,
	.redesigning h2 {
		position: relative;
		z-index: 4;
		margin: 0 auto;
		color: var(--ink);
		font-family: var(--font-serif);
		font-weight: 400;
		letter-spacing: -0.045em;
		text-wrap: balance;
	}

	.redesigning h2 {
		width: 100%;
		max-width: 100%;
		font-size: clamp(1.85rem, 5.25vw, 3.3rem);
		line-height: 0.95;
		overflow-wrap: break-word;
	}

	.redesigning--tile h2 {
		width: min(100%, 31.25rem);
		max-width: 31.25rem;
		font-family: 'IM Fell English', serif;
		font-size: clamp(2.1rem, 5.6vw, 3.5rem);
		line-height: 1.08;
	}

	.redesigning__tooltip {
		position: fixed;
		z-index: 2147483647;
		top: var(--tooltip-y, 50%);
		left: var(--tooltip-x, 50%);
		padding: 0.45rem 0.68rem;
		color: hsl(42, 59%, 91%);
		font-family: var(--font-sans);
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

	.redesigning__page-column {
		position: absolute;
		z-index: 6;
		top: 50%;
		width: clamp(5rem, 6vw, 6.5rem);
		aspect-ratio: 5 / 18;
		height: auto;
		overflow: hidden;
		pointer-events: none;
		opacity: 0.72;
		filter: drop-shadow(0 2rem 2.4rem rgba(52, 34, 12, 0.22));
		transform: translateY(-50%);
	}

	.redesigning__page-column--left {
		left: clamp(1rem, 4vw, 3rem);
	}

	.redesigning__page-column--right {
		right: clamp(1rem, 4vw, 3rem);
	}

	.redesigning__page-column-art {
		position: absolute;
		inset: 0;
		z-index: 1;
		filter: saturate(0.82) sepia(0.16);
	}

	.redesigning__page-shell {
		position: relative;
		z-index: 4;
		isolation: isolate;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		width: min(80vw, 72rem);
		min-height: min(80vh, 54rem);
		gap: clamp(2rem, 5vw, 4rem);
		padding: clamp(2rem, 6vw, 5rem);
		background: rgba(250, 237, 198, 0.76);
		border: 1px solid rgba(83, 55, 19, 0.2);
		border-radius: 2rem;
		box-shadow:
			inset 0 0 3rem rgba(91, 61, 20, 0.08),
			0 1.6rem 4rem rgba(49, 33, 12, 0.22);
		backdrop-filter: blur(12px);
		transform: translateY(clamp(-3rem, -5vh, -1.5rem));
	}

	.redesigning__olive--page-top,
	.redesigning__olive--page-bottom {
		z-index: 1;
		width: clamp(8rem, 17vw, 14rem);
		opacity: 0.58;
		filter: saturate(0.68) contrast(1.03) sepia(0.18)
			drop-shadow(0 0.8rem 1rem rgba(52, 34, 12, 0.12));
	}

	.redesigning__olive--page-top {
		top: clamp(-3.4rem, -4vw, -1.8rem);
		left: clamp(-2.6rem, -2.8vw, -0.9rem);
		transform: rotate(-16deg);
		transform-origin: 24% 42%;
	}

	.redesigning__olive--page-bottom {
		right: clamp(-2.8rem, -3vw, -1rem);
		bottom: clamp(-3.2rem, -4vw, -1.6rem);
		transform: scaleX(-1) rotate(-14deg);
		transform-origin: 76% 58%;
	}

	.redesigning__page-header {
		position: relative;
		z-index: 2;
		display: grid;
		gap: clamp(0.85rem, 2vw, 1.25rem);
		text-align: center;
	}

	.redesigning--page h1 {
		width: 100%;
		max-width: none;
		font-family: 'IM Fell English', serif;
		font-size: clamp(2rem, 5.2vw, 4rem);
		line-height: 0.98;
		letter-spacing: -0.024em;
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
		position: relative;
		z-index: 2;
		display: grid;
		align-content: start;
		width: 100%;
		max-width: none;
		min-height: 0;
		gap: 1.15rem;
		margin: 0 auto;
		overflow: auto;
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
		}
	}

	@media (max-width: 42rem) {
		.redesigning h2 {
			font-size: clamp(2.15rem, 12vw, 3.4rem);
		}

		.redesigning__page-column {
			width: clamp(4rem, 12vw, 5rem);
			opacity: 0.2;
			filter: blur(0.5px) saturate(0.8);
		}

		.redesigning__page-column--left {
			left: clamp(0.35rem, 3vw, 1rem);
		}

		.redesigning__page-column--right {
			right: clamp(0.35rem, 3vw, 1rem);
		}

		.redesigning__page-shell {
			width: min(100%, 56rem);
			min-height: auto;
			border-radius: 1.4rem;
			transform: translateY(clamp(-1.5rem, -3vh, -0.75rem));
		}

		.redesigning__olive--page-top,
		.redesigning__olive--page-bottom {
			width: clamp(6.5rem, 36vw, 9rem);
			opacity: 0.22;
		}

		.redesigning__olive--page-top {
			top: -1.6rem;
			left: -1.8rem;
		}

		.redesigning__olive--page-bottom {
			right: -1.8rem;
			bottom: -1.6rem;
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
		.redesigning__stage,
		.redesigning__olive,
		.redesigning__tooltip {
			transition: none;
		}
	}
</style>
