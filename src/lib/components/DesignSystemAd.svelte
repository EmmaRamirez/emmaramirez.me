<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<section class="design-system-ad relative h-full w-full overflow-hidden rounded-xl border border-(--border-color) {className}">
	<div class="design-system-ad__backdrop" aria-hidden="true"></div>
	<div class="design-system-ad__grain" aria-hidden="true"></div>
	<div class="design-system-ad__content">
		<p class="ad-kicker">Broadcasting live</p>
		<h3>The EMZINNIA design system</h3>
		<p class="ad-body">
			Lurid neon grids, brutal type, and posterized widgets for teams who want
			their product to hit like a midnight pirate radio spot.
		</p>
		<div class="ad-cta">
			<span class="ad-cta__glare" aria-hidden="true"></span>
			<span class="ad-cta__text">Preview the kit</span>
			<span class="ad-cta__burst" aria-hidden="true">⚡</span>
		</div>
	</div>
</section>

<style>
	.design-system-ad {
		background:
			linear-gradient(135deg, rgba(255, 48, 108, 0.16), rgba(0, 190, 255, 0.14)),
			radial-gradient(circle at 20% 20%, rgba(255, 199, 44, 0.3), transparent 32%),
			radial-gradient(circle at 80% 70%, rgba(87, 13, 255, 0.4), transparent 30%),
			var(--surface);
		box-shadow:
			0 20px 50px rgba(0, 0, 0, 0.25),
			0 0 0 1px rgba(255, 255, 255, 0.04);
	}

	.design-system-ad__backdrop {
		position: absolute;
		inset: -8%;
		background-image:
			repeating-linear-gradient(
				120deg,
				rgba(255, 255, 255, 0.2) 0,
				rgba(255, 255, 255, 0.2) 6px,
				transparent 8px,
				transparent 18px
			),
			repeating-linear-gradient(
				-120deg,
				rgba(0, 0, 0, 0.25) 0,
				rgba(0, 0, 0, 0.25) 6px,
				transparent 8px,
				transparent 18px
			);
		mix-blend-mode: screen;
		opacity: 0.5;
		filter: saturate(165%) contrast(125%);
		pointer-events: none;
	}

	.design-system-ad__grain {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(rgba(255, 255, 255, 0.4) 0.8px, transparent 0.8px);
		background-size: 10px 10px;
		mix-blend-mode: lighten;
		opacity: 0.4;
		pointer-events: none;
	}

	.design-system-ad__content {
		position: relative;
		z-index: 1;
		display: grid;
		gap: 0.65rem;
		padding: 1.4rem;
		color: var(--text-primary);
		filter: contrast(115%) saturate(130%);
	}

	.ad-kicker {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--text-secondary);
	}

	.design-system-ad h3 {
		font-size: clamp(1.4rem, 1.6vw + 1rem, 2rem);
		line-height: 1.1;
		font-weight: 800;
		text-transform: uppercase;
		text-shadow:
			0 0.1em 0 rgba(0, 0, 0, 0.35),
			0 0.2em 0 rgba(255, 43, 99, 0.35);
	}

	.ad-body {
		max-width: 45ch;
		font-size: 0.98rem;
		line-height: 1.5;
		color: var(--text-muted);
	}

	.ad-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.75rem 1rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.35);
		background: linear-gradient(120deg, rgba(255, 76, 106, 0.9), rgba(21, 216, 255, 0.85));
		color: #0a0a0a;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		position: relative;
		overflow: hidden;
		box-shadow:
			0 12px 28px rgba(0, 0, 0, 0.28),
			0 0 0 1px rgba(255, 255, 255, 0.25);
	}

	.ad-cta__text {
		position: relative;
		z-index: 1;
	}

	.ad-cta__glare {
		position: absolute;
		inset: -40% 60% auto -40%;
		height: 180%;
		background: radial-gradient(circle at center, rgba(255, 255, 255, 0.85), transparent 55%);
		filter: blur(12px);
		transform: rotate(-8deg);
		opacity: 0.8;
	}

	.ad-cta__burst {
		position: relative;
		z-index: 1;
		font-size: 1.1rem;
	}

	.ad-cta:hover {
		transform: translateY(-1px) scale(1.01);
		box-shadow:
			0 16px 36px rgba(0, 0, 0, 0.32),
			0 0 0 1px rgba(255, 255, 255, 0.35);
	}
</style>

