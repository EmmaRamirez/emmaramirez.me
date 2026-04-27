<script lang="ts">
	import DesignComponentGallery from '$lib/components/design/DesignComponentGallery.svelte';
	import { designComponentCount } from '$lib/registry/designComponents';
</script>

<svelte:head>
	<title>Design System | EMZINNIA</title>
	<meta
		name="description"
		content="A complete gallery of every Svelte component in the EMZINNIA site."
	/>
</svelte:head>

<div class="design-page">
	<div class="design-page__starfield" aria-hidden="true"></div>
	<div class="design-page__glow design-page__glow--blue" aria-hidden="true"></div>
	<div class="design-page__glow design-page__glow--magenta" aria-hidden="true"></div>
	<div class="design-page__glow design-page__glow--ember" aria-hidden="true"></div>

	<main class="design-page__inner">
		<section class="design-hero" aria-labelledby="design-page-title">
			<div class="design-hero__copy">
				<p class="design-hero__eyebrow">
					<span class="design-hero__sparkle" aria-hidden="true">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2.4 13.7 9 20 10.7 13.7 12.4 12 19l-1.7-6.6L4 10.7 10.3 9z" />
						</svg>
					</span>
					Design system
				</p>
				<h1 id="design-page-title" class="design-hero__title">
					<span class="design-hero__title-static">A field guide to</span>
					<span class="design-hero__title-gradient">every component</span>
					<span class="design-hero__title-static">in this codebase.</span>
				</h1>
				<p class="design-hero__lede">
					{designComponentCount} Svelte components, from reusable UI primitives through editor surfaces,
					hero scenes, and debug tools. Each entry shows what it does, how it composes, and what it depends
					on at runtime.
				</p>

				<dl class="design-hero__stats">
					<div>
						<dt>Components</dt>
						<dd>{designComponentCount}</dd>
					</div>
					<div>
						<dt>Categories</dt>
						<dd>10</dd>
					</div>
					<div>
						<dt>Source root</dt>
						<dd><code>src/lib/components</code></dd>
					</div>
				</dl>
			</div>

			<div class="design-hero__orb" aria-hidden="true">
				<span class="design-hero__orb-ring design-hero__orb-ring--outer"></span>
				<span class="design-hero__orb-ring design-hero__orb-ring--inner"></span>
				<span class="design-hero__orb-core"></span>
				<span class="design-hero__orb-highlight"></span>
				<span class="design-hero__orb-dot"></span>
				<svg
					class="design-hero__orb-sparkle"
					viewBox="0 0 64 64"
					fill="none"
					stroke="currentColor"
					stroke-width="0"
				>
					<path
						d="M32 6c1.5 9.5 6.5 14.5 16 16-9.5 1.5-14.5 6.5-16 16-1.5-9.5-6.5-14.5-16-16 9.5-1.5 14.5-6.5 16-16z"
						fill="currentColor"
					/>
				</svg>
			</div>
		</section>

		<DesignComponentGallery />
	</main>
</div>

<style>
	.design-page {
		position: relative;
		isolation: isolate;
		min-height: 100vh;
		overflow: hidden;
		background:
			radial-gradient(ellipse at 20% 0%, #1f2147 0%, transparent 60%),
			radial-gradient(ellipse at 100% 80%, #2a1140 0%, transparent 55%),
			linear-gradient(180deg, #0c0d1c 0%, #11122a 60%, #0a0b1a 100%);
		color: #e9eaff;
		--design-text: #e9eaff;
		--design-muted: rgba(225, 226, 255, 0.62);
		--design-subtle: rgba(225, 226, 255, 0.42);
		--design-border: rgba(255, 255, 255, 0.08);
		--design-border-strong: rgba(255, 255, 255, 0.16);
		--design-surface: rgba(20, 21, 45, 0.72);
		--design-surface-strong: rgba(28, 30, 58, 0.85);
		--design-card: rgba(255, 255, 255, 0.04);
		--design-card-hover: rgba(255, 255, 255, 0.08);
		--design-orb-from: #2d4ad4;
		--design-orb-via: #9936b6;
		--design-orb-pink: #d73a82;
		--design-orb-to: #f9614c;
		--design-orb-mint: #f2b1c9;
	}

	.design-page__starfield {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background-image:
			radial-gradient(1.25px 1.25px at 12% 18%, rgba(255, 255, 255, 0.6) 100%, transparent 100%),
			radial-gradient(1px 1px at 78% 32%, rgba(255, 255, 255, 0.55) 100%, transparent 100%),
			radial-gradient(1.5px 1.5px at 62% 12%, rgba(255, 220, 255, 0.5) 100%, transparent 100%),
			radial-gradient(1px 1px at 28% 78%, rgba(255, 255, 255, 0.5) 100%, transparent 100%),
			radial-gradient(1px 1px at 88% 88%, rgba(255, 200, 230, 0.4) 100%, transparent 100%),
			radial-gradient(1.25px 1.25px at 6% 62%, rgba(255, 255, 255, 0.45) 100%, transparent 100%),
			radial-gradient(1px 1px at 48% 48%, rgba(255, 255, 255, 0.35) 100%, transparent 100%),
			radial-gradient(1px 1px at 92% 4%, rgba(255, 255, 255, 0.45) 100%, transparent 100%);
		background-repeat: no-repeat;
		opacity: 0.85;
	}

	.design-page__glow {
		position: absolute;
		z-index: 0;
		pointer-events: none;
		filter: blur(7rem);
		opacity: 0.55;
	}

	.design-page__glow--blue {
		top: -8rem;
		left: -10rem;
		width: 32rem;
		height: 32rem;
		background: radial-gradient(circle, var(--design-orb-from) 0%, transparent 65%);
	}

	.design-page__glow--magenta {
		top: 18rem;
		right: -6rem;
		width: 28rem;
		height: 28rem;
		background: radial-gradient(circle, var(--design-orb-via) 0%, transparent 65%);
		opacity: 0.45;
	}

	.design-page__glow--ember {
		bottom: -10rem;
		left: 30%;
		width: 36rem;
		height: 36rem;
		background: radial-gradient(circle, var(--design-orb-to) 0%, transparent 65%);
		opacity: 0.35;
	}

	.design-page__inner {
		position: relative;
		z-index: 1;
		display: grid;
		gap: clamp(2.5rem, 5vw, 4rem);
		width: min(100% - 2rem, 84rem);
		margin: 0 auto;
		padding: clamp(2.5rem, 6vw, 6rem) 0 clamp(4rem, 8vw, 6rem);
	}

	.design-hero {
		display: grid;
		gap: clamp(2rem, 4vw, 4rem);
		grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
		align-items: center;
	}

	@media (max-width: 60rem) {
		.design-hero {
			grid-template-columns: 1fr;
		}
	}

	.design-hero__copy {
		display: grid;
		gap: 1.5rem;
		max-width: 42rem;
	}

	.design-hero__eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		width: fit-content;
		margin: 0;
		padding: 0.4rem 0.9rem;
		border: 0.0625rem solid var(--design-border-strong);
		border-radius: 9999px;
		background: linear-gradient(
			135deg,
			rgba(45, 74, 212, 0.18),
			rgba(153, 54, 182, 0.18),
			rgba(249, 97, 76, 0.18)
		);
		color: var(--design-text);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		backdrop-filter: blur(0.5rem);
	}

	.design-hero__sparkle {
		display: inline-flex;
		width: 0.875rem;
		height: 0.875rem;
		color: var(--design-orb-mint);
		filter: drop-shadow(0 0 0.5rem rgba(242, 177, 201, 0.7));
	}

	.design-hero__title {
		margin: 0;
		font-size: clamp(2.75rem, 8vw, 5.5rem);
		font-weight: 400;
		line-height: 0.95;
		letter-spacing: -0.04em;
	}

	.design-hero__title-static,
	.design-hero__title-gradient {
		display: block;
	}

	.design-hero__title-static {
		color: var(--design-text);
	}

	.design-hero__title-gradient {
		background: linear-gradient(
			115deg,
			var(--design-orb-from) 0%,
			var(--design-orb-via) 45%,
			var(--design-orb-pink) 70%,
			var(--design-orb-to) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		filter: drop-shadow(0 0.5rem 1.5rem rgba(217, 58, 130, 0.35));
	}

	.design-hero__lede {
		margin: 0;
		max-width: 38rem;
		color: var(--design-muted);
		font-size: clamp(1rem, 1.4vw, 1.125rem);
		line-height: 1.55;
	}

	.design-hero__stats {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		margin: 0.5rem 0 0;
		padding: 1rem 1.25rem;
		border: 0.0625rem solid var(--design-border);
		border-radius: 1rem;
		background: var(--design-surface);
		backdrop-filter: blur(0.5rem);
	}

	@media (max-width: 32rem) {
		.design-hero__stats {
			grid-template-columns: 1fr;
		}
	}

	.design-hero__stats div {
		display: grid;
		gap: 0.25rem;
	}

	.design-hero__stats dt {
		margin: 0;
		color: var(--design-subtle);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.design-hero__stats dd {
		margin: 0;
		color: var(--design-text);
		font-size: 1.125rem;
		font-weight: 700;
		font-family: 'DM Serif Text', serif;
		letter-spacing: -0.01em;
	}

	.design-hero__stats code {
		font-family:
			'JetBrains Mono',
			ui-monospace,
			SFMono-Regular,
			SF Mono,
			Menlo,
			Consolas,
			Liberation Mono,
			monospace;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--design-muted);
	}

	.design-hero__orb {
		position: relative;
		justify-self: center;
		width: clamp(15rem, 28vw, 24rem);
		aspect-ratio: 1;
	}

	.design-hero__orb-ring {
		position: absolute;
		inset: 0;
		border-radius: 9999px;
		border: 0.0625rem solid rgba(255, 255, 255, 0.1);
	}

	.design-hero__orb-ring--outer {
		inset: -2.5rem;
		border-color: rgba(255, 255, 255, 0.06);
	}

	.design-hero__orb-ring--inner {
		inset: -1rem;
		border-color: rgba(255, 255, 255, 0.12);
	}

	.design-hero__orb-core {
		position: absolute;
		inset: 0;
		border-radius: 9999px;
		background:
			radial-gradient(circle at 28% 28%, rgba(255, 255, 255, 0.45) 0%, transparent 30%),
			radial-gradient(circle at 35% 35%, var(--design-orb-from) 0%, transparent 55%),
			radial-gradient(circle at 70% 75%, var(--design-orb-to) 0%, transparent 60%),
			linear-gradient(
				135deg,
				var(--design-orb-from) 0%,
				var(--design-orb-via) 50%,
				var(--design-orb-pink) 75%,
				var(--design-orb-to) 100%
			);
		box-shadow:
			0 0 4rem rgba(45, 74, 212, 0.45),
			0 0 8rem rgba(217, 58, 130, 0.35),
			inset 0 -1.5rem 4rem rgba(0, 0, 0, 0.35);
		animation: orb-float 9s ease-in-out infinite;
	}

	.design-hero__orb-highlight {
		position: absolute;
		top: 12%;
		left: 22%;
		width: 26%;
		height: 18%;
		border-radius: 50%;
		background: radial-gradient(ellipse, rgba(255, 255, 255, 0.55) 0%, transparent 70%);
		filter: blur(0.75rem);
		pointer-events: none;
	}

	.design-hero__orb-dot {
		position: absolute;
		top: 56%;
		right: 18%;
		width: 1rem;
		height: 1rem;
		border-radius: 9999px;
		background: var(--design-orb-mint);
		box-shadow: 0 0 1.5rem rgba(242, 177, 201, 0.85);
	}

	.design-hero__orb-sparkle {
		position: absolute;
		top: 30%;
		left: 48%;
		width: 36%;
		height: 36%;
		color: rgba(255, 240, 250, 0.95);
		filter: drop-shadow(0 0 1.5rem rgba(255, 220, 240, 0.85));
	}

	@keyframes orb-float {
		0%,
		100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-0.75rem) scale(1.02);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.design-hero__orb-core {
			animation: none;
		}
	}
</style>
