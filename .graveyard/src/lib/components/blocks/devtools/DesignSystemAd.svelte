<script lang="ts">
	interface Props {
		class?: string;
		onclick?: () => void;
	}

	let { class: className = '', onclick }: Props = $props();
</script>

<div
	class="design-system-ad style-none relative h-full w-full overflow-hidden rounded-xl border border-(--border-color) text-left {className}"
>
	<div class="design-system-ad__backdrop" aria-hidden="true"></div>
	<div class="design-system-ad__grain" aria-hidden="true"></div>
	<div class="design-system-ad__content w-full">
		<h3>The EMZINNIA design system</h3>
		<p class="ad-body w-full">
			This site is built with its own internal design system. Check it out!
		</p>
		<button type="button" class="ad-cta" {onclick}>
			<span class="ad-cta__glare" aria-hidden="true"></span>
			<span class="ad-cta__text">Explore</span>
		</button>
	</div>
</div>

<style>
	.design-system-ad {
		background: var(--surface);
		box-shadow:
			0 1.25rem 3.125rem rgba(0, 0, 0, 0.25),
			0 0 0 0.0625rem var(--border-color);
		position: relative;
	}

	.design-system-ad__backdrop {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(var(--border-color) 0.0625rem, transparent 0.0625rem),
			linear-gradient(90deg, var(--border-color) 0.0625rem, transparent 0.0625rem);
		background-size: 1.25rem 1.25rem;
		opacity: 0.25;
		pointer-events: none;
	}

	:global(.dark) .design-system-ad__backdrop {
		opacity: 0.5;
	}

	.design-system-ad__grain {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			transparent 0%,
			var(--accent-primary) 50%,
			transparent 100%
		);
		opacity: 0.05;
		pointer-events: none;
	}

	.design-system-ad__content {
		position: relative;
		z-index: 1;
		display: grid;
		gap: 0.85rem;
		padding: 1.4rem;
		color: var(--text-primary);
	}

	.design-system-ad h3 {
		font-size: clamp(1.4rem, 1.6vw + 1rem, 2rem);
		line-height: 1.1;
		font-weight: 800;
		text-transform: uppercase;
		color: var(--text-primary);
		text-shadow:
			0 0.08em 0 var(--surface),
			0 0.15em 0.1em var(--accent-primary);
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
		justify-content: center;
		gap: 0.45rem;
		padding: 0.75rem 1.5rem;
		border-radius: 62.4375rem;
		border: 0.0625rem solid var(--border-color);
		background: var(--accent-primary);
		color: var(--text-primary);
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.85rem;
		position: relative;
		overflow: hidden;
		box-shadow:
			0 0.25rem 0.75rem rgba(0, 0, 0, 0.15),
			0 0 0 0.0625rem var(--border-color);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
	}

	.ad-cta__text {
		position: relative;
		z-index: 1;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.ad-cta__glare {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			transparent 0%,
			var(--accent-secondary) 50%,
			transparent 100%
		);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.ad-cta:hover {
		transform: translateY(-0.125rem) scale(1.02);
		box-shadow:
			0 0.75rem 2rem rgba(0, 0, 0, 0.25),
			0 0 0 0.0625rem var(--accent-primary),
			0 0 1.25rem rgba(var(--accent-primary-rgb, 255, 100, 150), 0.3);
		border-color: var(--accent-primary);
	}

	.ad-cta:hover .ad-cta__text {
		transform: scale(1.05);
	}

	.ad-cta:hover .ad-cta__glare {
		opacity: 0.4;
	}

	.ad-cta:active {
		transform: translateY(0) scale(0.98);
		transition-duration: 0.1s;
	}
</style>
