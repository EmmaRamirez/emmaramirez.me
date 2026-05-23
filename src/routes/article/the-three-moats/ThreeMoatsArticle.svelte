<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import waterImage from '$lib/images/photos/water.png';

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

	let isOpening = $state(false);
	let tooltipVisible = $state(false);
	let tooltipX = $state(160);
	let tooltipY = $state(160);

	const articleHref = resolve('/article/the-three-moats');
	const title = 'The Three Moats';
	const subtitle = 'Left In The Technology Industry and Also Every Other Industry Imaginable';
	const waterLayers = [0, 1, 2, 3] as const;
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
	<article class="three-moats three-moats--page" aria-labelledby="three-moats-title">
		<div class="three-moats__shell" aria-hidden="true">
			<div class="three-moats__layer three-moats__layer--outer">
				<div class="three-moats__layer three-moats__layer--middle">
					<div class="three-moats__layer three-moats__layer--inner"></div>
				</div>
			</div>
		</div>

		<div class="three-moats__page-copy">
			<header class="three-moats__page-header">
				<p class="three-moats__eyebrow">Article</p>
				<h1 id="three-moats-title">{title}</h1>
				<p class="three-moats__subtitle">{subtitle}</p>
			</header>

			<div class="three-moats__body">
				<p>
					This is placeholder copy for an article about what still works when every obvious
					advantage can be copied, purchased, automated, or compressed into a product roadmap.
				</p>
				<p>
					The finished piece will trace three defenses that are harder to imitate: trust earned over
					time, taste formed through direct contact with the work, and distribution that comes from
					showing up where the audience already lives.
				</p>
				<p>
					For now, this shell holds the shape of the essay: a practical argument about moats, labor,
					leverage, and the parts of an industry that remain stubbornly human.
				</p>
			</div>
		</div>
	</article>
{:else}
	<article
		class={['three-moats', 'three-moats--tile', isOpening && 'three-moats--opening']}
		aria-labelledby="three-moats-tile-title"
	>
		<a
			class="three-moats__link style-none"
			href={articleHref}
			aria-label="Read The Three Moats"
			onclick={openArticle}
			onpointermove={updateTooltip}
			onpointerenter={updateTooltip}
			onpointerleave={() => (tooltipVisible = false)}
			onfocus={() => (tooltipVisible = true)}
			onblur={() => (tooltipVisible = false)}
		>
			<div class="three-moats__layer three-moats__layer--outer">
				<div class="three-moats__layer three-moats__layer--middle">
					<div
						class="three-moats__water-screen"
						style:--water-image={`url(${waterImage})`}
						aria-hidden="true"
					>
						{#each waterLayers as waterLayer (waterLayer)}
							<span class="three-moats__water-panel" style:--water-layer={waterLayer}></span>
						{/each}
					</div>

					<div class="three-moats__layer three-moats__layer--inner">
						<div class="three-moats__tile-copy">
							<h2 id="three-moats-tile-title">{title}</h2>
							<p class="three-moats__subtitle">{subtitle}</p>
						</div>
					</div>
				</div>
			</div>
		</a>
	</article>

	<span
		class={['three-moats__tooltip', tooltipVisible && 'three-moats__tooltip--visible']}
		style:--tooltip-x={`${tooltipX}px`}
		style:--tooltip-y={`${tooltipY}px`}
		aria-hidden="true"
	>
		Read Article
	</span>
{/if}

<style>
	.three-moats {
		--moats-ink: var(--text-primary);
		--moats-muted: color-mix(in srgb, var(--text-primary) 72%, var(--caroline-blue-700));
		--moats-blue: var(--caroline-blue-500);
		--moats-blue-soft: var(--caroline-blue-100);
		--moats-pink: var(--blush-pink-500);
		--moats-mint: var(--magic-mint-500);
		--moats-yellow: var(--transit-yellow-500);
		--moats-yellow-soft: var(--transit-yellow-100);

		position: relative;
		isolation: isolate;
		min-width: 0;
		color: var(--moats-ink);
	}

	.three-moats__layer {
		position: relative;
		display: grid;
		min-width: 0;
		border: 1px solid color-mix(in srgb, var(--border-color) 68%, transparent);
	}

	.three-moats__layer--outer {
		width: 100%;
		height: 100%;
		padding: clamp(0.7rem, 2vw, 1rem);
		background:
			radial-gradient(
				circle at 18% 18%,
				color-mix(in srgb, var(--moats-pink) 55%, transparent),
				transparent 9rem
			),
			linear-gradient(135deg, var(--moats-blue-soft), var(--card-bg) 52%, var(--moats-yellow-soft));
		border-radius: 1.5rem;
		box-shadow:
			inset 0 0 0 0.2rem color-mix(in srgb, var(--moats-blue) 12%, transparent),
			0 1.1rem 2.4rem color-mix(in srgb, var(--moats-blue) 18%, transparent);
	}

	.three-moats__layer--middle {
		padding: clamp(0.7rem, 2vw, 1rem);
		background:
			linear-gradient(
				90deg,
				color-mix(in srgb, var(--moats-mint) 34%, transparent),
				transparent 32%
			),
			color-mix(in srgb, var(--card-bg) 82%, var(--moats-yellow));
		border-color: color-mix(in srgb, var(--moats-pink) 50%, var(--border-color));
		border-radius: 1.15rem;
	}

	.three-moats__layer--inner {
		place-items: center;
		padding: clamp(0.5rem, 4vw, 2.3rem);
		overflow: hidden;
		text-align: center;
		background: transparent;
		border-color: color-mix(in srgb, var(--moats-mint) 58%, var(--border-color));
		border-radius: 0.9rem;
	}

	.three-moats--tile {
		align-self: stretch;
		height: 100%;
		min-height: clamp(15rem, 25vw, 20rem);
		overflow: visible;
		border-radius: 1.5rem;
	}

	.three-moats--tile .three-moats__layer--inner {
		z-index: 1;
		padding-inline: clamp(0.75rem, 5vw, 1.35rem);
		background: transparent;
		box-shadow: 0 0.8rem 2rem color-mix(in srgb, var(--moats-blue) 16%, transparent);
		backdrop-filter: blur(10px);
	}

	.three-moats--tile .three-moats__layer--middle {
		overflow: hidden;
		isolation: isolate;
		background:
			linear-gradient(color-mix(in srgb, var(--moats-blue-soft) 38%, transparent), transparent),
			color-mix(in srgb, var(--card-bg) 78%, var(--moats-yellow));
	}

	.three-moats__water-screen {
		position: absolute;
		inset: 0;
		z-index: 0;
		overflow: hidden;
		background: color-mix(in srgb, var(--moats-blue) 16%, transparent);
		border-radius: inherit;
		pointer-events: none;
	}

	.three-moats__water-screen::after {
		position: absolute;
		inset: 0;
		content: '';
		background:
			linear-gradient(
				120deg,
				transparent 18%,
				color-mix(in srgb, white 28%, transparent) 48%,
				transparent 76%
			),
			radial-gradient(
				circle at 30% 28%,
				color-mix(in srgb, white 24%, transparent),
				transparent 34%
			);
		mix-blend-mode: screen;
		opacity: 0.55;
	}

	.three-moats__water-panel {
		position: absolute;
		width: 62%;
		height: 58%;
		background-image: var(--water-image);
		background-repeat: repeat;
		background-size: 8rem 8rem;
		border: 1px solid color-mix(in srgb, white 24%, transparent);
		border-radius: 0.75rem;
		box-shadow: inset 0 0 1.4rem color-mix(in srgb, var(--moats-blue) 36%, transparent);
		filter: saturate(1.3) contrast(0.9);
		mix-blend-mode: multiply;
		opacity: 0.58;
		transform: translate3d(0, 0, 0) rotate(var(--water-rotation, 0deg));
		animation: three-moats-water-screen 16s linear infinite;
		animation-delay: calc(var(--water-layer) * -2.6s);
	}

	.three-moats__water-panel:nth-child(1) {
		--water-rotation: -8deg;
		top: -12%;
		left: -12%;
	}

	.three-moats__water-panel:nth-child(2) {
		--water-rotation: 8deg;
		top: -8%;
		right: -14%;
	}

	.three-moats__water-panel:nth-child(3) {
		--water-rotation: 5deg;
		right: -10%;
		bottom: -14%;
	}

	.three-moats__water-panel:nth-child(4) {
		--water-rotation: -5deg;
		bottom: -10%;
		left: -16%;
	}

	.three-moats__link {
		display: block;
		width: 100%;
		height: 100%;
		color: inherit;
		text-decoration: none;
		border-radius: inherit;
		transition:
			filter 180ms ease,
			transform 180ms ease;
	}

	.three-moats__link:focus-visible .three-moats__layer--outer {
		box-shadow:
			inset 0 0 0 0.2rem color-mix(in srgb, var(--moats-blue) 12%, transparent),
			0 0 0 0.18rem color-mix(in srgb, var(--moats-pink) 74%, transparent),
			0 1.1rem 2.4rem color-mix(in srgb, var(--moats-blue) 18%, transparent);
	}

	.three-moats--opening .three-moats__link {
		filter: saturate(1.15) brightness(1.03);
		transform: scale(1.02);
	}

	.three-moats__tile-copy,
	.three-moats__page-header {
		display: grid;
		gap: clamp(0.65rem, 1.6vw, 1rem);
		justify-items: center;
	}

	.three-moats--tile .three-moats__tile-copy {
		align-content: center;
		width: min(100%, 12rem);
		min-height: 100%;
		gap: clamp(0.75rem, 1.5vw, 1rem);
		text-align: center;
	}

	.three-moats__eyebrow {
		margin: 0;
		color: color-mix(in srgb, var(--moats-blue) 82%, var(--moats-ink));
		font-family: var(--font-sans);
		font-size: 0.76rem;
		font-weight: 850;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.three-moats h1,
	.three-moats h2 {
		margin: 0;
		color: var(--moats-ink);
		font-family: var(--font-serif);
		font-weight: 400;
		letter-spacing: -0.045em;
		text-wrap: balance;
	}

	.three-moats h2 {
		max-width: 11ch;
		font-size: clamp(1rem, 7vw, 3rem);
		line-height: 1.05;
	}

	.three-moats__subtitle {
		max-width: 34rem;
		margin: 0;
		color: var(--moats-muted);
		font-family: var(--font-sans);
		font-size: clamp(0.88rem, 1.9vw, 1.12rem);
		font-weight: light;
		line-height: 1.35;
		text-wrap: balance;
	}

	.three-moats--tile .three-moats__subtitle {
		max-width: 18ch;
	}

	.three-moats__tooltip {
		--moats-ink: var(--text-primary);
		--moats-blue: var(--caroline-blue-500);
		--moats-yellow: var(--transit-yellow-500);

		position: fixed;
		z-index: 2147483647;
		top: var(--tooltip-y, 50%);
		left: var(--tooltip-x, 50%);
		padding: 0.45rem 0.68rem;
		color: var(--moats-ink);
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 850;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		white-space: nowrap;
		background: var(--card-bg);
		border: 1px solid color-mix(in srgb, var(--moats-yellow) 58%, var(--border-color));
		border-radius: 999px;
		box-shadow: 0 0.8rem 1.8rem color-mix(in srgb, var(--moats-blue) 22%, transparent);
		opacity: 0;
		pointer-events: none;
		transform: translate(0.85rem, 0.85rem) scale(0.96);
		transition:
			opacity 120ms ease,
			transform 120ms ease;
	}

	.three-moats__tooltip--visible {
		opacity: 1;
		transform: translate(0.85rem, 0.85rem) scale(1);
	}

	.three-moats--page {
		--moats-measure: min(100%, 38rem);

		display: grid;
		min-height: 100vh;
		place-items: center;
		padding: clamp(2rem, 7vw, 6rem) 1rem;
		overflow: hidden;
		background:
			radial-gradient(
				circle at 10% 18%,
				color-mix(in srgb, var(--moats-pink) 34%, transparent),
				transparent 18rem
			),
			radial-gradient(
				circle at 88% 86%,
				color-mix(in srgb, var(--moats-mint) 32%, transparent),
				transparent 22rem
			),
			linear-gradient(
				150deg,
				var(--card-bg),
				color-mix(in srgb, var(--moats-blue-soft) 54%, var(--card-bg))
			);
	}

	.three-moats__shell {
		position: absolute;
		inset: clamp(1rem, 3vw, 2.4rem);
		z-index: 1;
		pointer-events: none;
		opacity: 0.78;
	}

	.three-moats__page-copy {
		position: relative;
		z-index: 2;
		display: grid;
		justify-items: center;
		width: min(100%, calc(var(--moats-measure) + clamp(2.5rem, 7vw, 6rem)));
		gap: clamp(1.75rem, 4vw, 2.75rem);
		padding: clamp(2rem, 5vw, 3.5rem);
		background: color-mix(in srgb, var(--card-bg) 88%, transparent);
		border: 1px solid color-mix(in srgb, var(--border-color) 68%, transparent);
		border-radius: 1.5rem;
		box-shadow:
			inset 0 0 0 0.35rem color-mix(in srgb, var(--moats-yellow) 12%, transparent),
			0 1.6rem 4rem color-mix(in srgb, var(--moats-blue) 24%, transparent);
		backdrop-filter: blur(14px);
	}

	.three-moats--page .three-moats__page-header {
		width: var(--moats-measure);
		gap: clamp(0.75rem, 1.8vw, 1.1rem);
	}

	.three-moats--page h1 {
		max-width: none;
		width: 100%;
		font-size: clamp(2.35rem, 6vw, 4.75rem);
		line-height: 0.94;
		text-align: center;
	}

	.three-moats--page .three-moats__subtitle {
		max-width: none;
		width: 100%;
		font-size: clamp(1rem, 2vw, 1.32rem);
		line-height: 1.5;
	}

	.three-moats__body {
		display: grid;
		width: var(--moats-measure);
		gap: 1.1rem;
		color: color-mix(in srgb, var(--moats-ink) 84%, var(--moats-blue));
		font-size: clamp(1rem, 1.55vw, 1.18rem);
		line-height: 1.85;
	}

	.three-moats__body p {
		margin: 0;
	}

	@supports (view-transition-name: none) {
		.three-moats {
			view-transition-name: three-moats-article;
			contain: layout;
		}

		:global(::view-transition-old(three-moats-article)),
		:global(::view-transition-new(three-moats-article)) {
			animation-duration: 540ms;
			animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
			overflow: clip;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.three-moats__link,
		.three-moats__tooltip {
			transition: none;
		}

		.three-moats__water-panel {
			animation: none;
		}
	}

	@keyframes three-moats-water-screen {
		from {
			background-position: 0 0;
			transform: translate3d(0, 0, 0) rotate(var(--water-rotation, 0deg));
		}

		to {
			background-position: 8rem 8rem;
			transform: translate3d(0.7rem, -0.55rem, 0) rotate(var(--water-rotation, 0deg));
		}
	}
</style>
