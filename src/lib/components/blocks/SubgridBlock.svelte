<script lang="ts">
	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();
</script>

<div class={['subgrid-block', className]}>
	<div class="subgrid-block__stage" aria-label="Signal garden">
		<div class="subgrid-block__orbits" aria-hidden="true">
			<span class="subgrid-block__ring subgrid-block__ring--outer"></span>
			<span class="subgrid-block__ring subgrid-block__ring--middle"></span>
			<span class="subgrid-block__ring subgrid-block__ring--inner"></span>
			<span class="subgrid-block__pip subgrid-block__pip--mint"></span>
			<span class="subgrid-block__pip subgrid-block__pip--blush"></span>
			<span class="subgrid-block__pip subgrid-block__pip--gold"></span>
		</div>

		<div class="subgrid-block__beam" aria-hidden="true"></div>

		<div class="subgrid-block__tiles" aria-hidden="true">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>

		<p>Signal garden</p>
	</div>
</div>

<style>
	.subgrid-block {
		position: relative;
		isolation: isolate;
		display: grid;
		min-height: min(28rem, calc(120vw - 2rem));
		min-width: 0;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--border-color) 58%, transparent);
		border-radius: 1.5rem;
		background:
			linear-gradient(135deg, color-mix(in srgb, var(--card-bg) 84%, transparent), transparent),
			radial-gradient(circle at 26% 20%, color-mix(in srgb, var(--magic-mint-500) 44%, transparent), transparent 9rem),
			radial-gradient(circle at 86% 78%, color-mix(in srgb, var(--blush-pink-500) 40%, transparent), transparent 10rem),
			radial-gradient(circle at 50% 54%, color-mix(in srgb, var(--color-accent) 24%, transparent), transparent 11rem),
			var(--card-bg);
		color: var(--text-primary);
		padding: 1rem;
	}

	.subgrid-block::before {
		position: absolute;
		inset: 0.75rem;
		z-index: -1;
		border: 1px solid color-mix(in srgb, white 18%, transparent);
		border-radius: 1rem;
		background-image:
			linear-gradient(color-mix(in srgb, var(--text-primary) 7%, transparent) 1px, transparent 1px),
			linear-gradient(90deg, color-mix(in srgb, var(--text-primary) 7%, transparent) 1px, transparent 1px);
		background-size: 1.4rem 1.4rem;
		content: '';
		mask-image: radial-gradient(circle at center, black, transparent 72%);
	}

	.subgrid-block__stage {
		position: relative;
		display: grid;
		min-height: 0;
		overflow: hidden;
		border-radius: 1rem;
		background:
			linear-gradient(165deg, color-mix(in srgb, white 14%, transparent), transparent 48%),
			color-mix(in srgb, var(--card-bg) 74%, transparent);
		box-shadow:
			inset 0 0 0 1px color-mix(in srgb, white 24%, transparent),
			inset 0 -2rem 4rem color-mix(in srgb, var(--blush-pink-500) 18%, transparent);
	}

	.subgrid-block__orbits {
		position: absolute;
		inset: 12%;
		display: grid;
		place-items: center;
	}

	.subgrid-block__ring {
		position: absolute;
		aspect-ratio: 1;
		border: 1px solid color-mix(in srgb, var(--text-primary) 20%, transparent);
		border-radius: 42% 58% 46% 54%;
		box-shadow:
			inset 0 0 2rem color-mix(in srgb, var(--magic-mint-500) 18%, transparent),
			0 0 3rem color-mix(in srgb, var(--blush-pink-500) 16%, transparent);
	}

	.subgrid-block__ring--outer {
		width: min(15rem, 78%);
		animation: subgrid-drift 18s linear infinite;
	}

	.subgrid-block__ring--middle {
		width: min(11rem, 58%);
		border-color: color-mix(in srgb, var(--magic-mint-500) 44%, transparent);
		transform: rotate(34deg);
		animation: subgrid-drift 13s linear infinite reverse;
	}

	.subgrid-block__ring--inner {
		width: min(6.5rem, 35%);
		border-color: color-mix(in srgb, var(--blush-pink-500) 48%, transparent);
		border-radius: 50%;
	}

	.subgrid-block__pip {
		position: absolute;
		aspect-ratio: 1;
		border-radius: 999rem;
		box-shadow: 0 0 1.75rem currentColor;
	}

	.subgrid-block__pip--mint {
		top: 18%;
		left: 18%;
		width: 1.1rem;
		background: var(--magic-mint-500);
		color: var(--magic-mint-500);
	}

	.subgrid-block__pip--blush {
		right: 16%;
		bottom: 24%;
		width: 1.55rem;
		background: var(--blush-pink-500);
		color: var(--blush-pink-500);
	}

	.subgrid-block__pip--gold {
		top: 42%;
		right: 26%;
		width: 0.75rem;
		background: var(--color-accent);
		color: var(--color-accent);
	}

	.subgrid-block__beam {
		position: absolute;
		inset: auto 11% 18%;
		height: 34%;
		border-radius: 999rem 999rem 0 0;
		background:
			linear-gradient(90deg, transparent, color-mix(in srgb, white 32%, transparent), transparent),
			linear-gradient(color-mix(in srgb, var(--color-accent) 36%, transparent), transparent);
		filter: blur(0.2px);
		mix-blend-mode: screen;
		transform: perspective(12rem) rotateX(62deg);
		transform-origin: bottom;
	}

	.subgrid-block__tiles {
		position: absolute;
		inset: auto 12% 11%;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.38rem;
		transform: perspective(12rem) rotateX(62deg);
		transform-origin: bottom;
	}

	.subgrid-block__tiles span {
		min-height: clamp(1.05rem, 5vw, 1.8rem);
		border: 1px solid color-mix(in srgb, white 28%, transparent);
		border-radius: 0.45rem;
		background:
			linear-gradient(145deg, color-mix(in srgb, white 20%, transparent), transparent),
			color-mix(in srgb, var(--magic-mint-500) 24%, var(--card-bg));
		box-shadow: 0 0.7rem 1.2rem color-mix(in srgb, var(--magic-mint-500) 15%, transparent);
	}

	.subgrid-block__tiles span:nth-child(2n) {
		background:
			linear-gradient(145deg, color-mix(in srgb, white 18%, transparent), transparent),
			color-mix(in srgb, var(--blush-pink-500) 26%, var(--card-bg));
	}

	.subgrid-block__stage p {
		align-self: end;
		justify-self: start;
		margin: 0;
		padding: 1.1rem;
		font-family: var(--font-serif);
		font-size: clamp(1.65rem, 8vw, 2.65rem);
		font-weight: 400;
		letter-spacing: -0.06em;
		line-height: 0.9;
		text-wrap: balance;
		text-shadow: 0 0.1rem 1.5rem color-mix(in srgb, var(--card-bg) 68%, transparent);
	}

	@keyframes subgrid-drift {
		to {
			rotate: 1turn;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.subgrid-block__ring {
			animation: none;
		}
	}

	@media (min-width: 48rem) {
		.subgrid-block {
			height: 100%;
			min-height: 100%;
			padding: 0.85rem;
		}

		.subgrid-block__stage p {
			padding: 0.95rem;
			font-size: clamp(1.5rem, 3vw, 2.3rem);
		}
	}
</style>
