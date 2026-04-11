<script lang="ts">
	import { thisSiteSettings } from '$lib/stores';

	interface Props {
		class?: string;
	}

	const stack = ['SvelteKit', 'TypeScript', 'Design tokens'];

	let { class: className = '' }: Props = $props();
	const title = $derived(thisSiteSettings.title);
</script>

<article class="this-site-block relative h-full w-full overflow-hidden rounded-xl {className}">
	<div class="this-site-block__glow" aria-hidden="true"></div>

	<div class="this-site-block__content">
		<div class="this-site-block__copy">
			<h3 class="this-site-block__title">{title}</h3>
		</div>

		<ul class="this-site-block__stack" aria-label="Core technologies">
			{#each stack as item (item)}
				<li>{item}</li>
			{/each}
		</ul>
	</div>
</article>

<style>
	.this-site-block {
		--this-site-bg: hsl(39, 100%, 77%);
		--this-site-text: hsl(24, 58%, 18%);
		--this-site-text-soft: color-mix(in srgb, var(--this-site-text) 76%, transparent);
		--this-site-chip-bg: color-mix(in srgb, var(--this-site-text) 10%, white);
		--this-site-border: color-mix(in srgb, var(--this-site-text) 16%, transparent);
		border: 0.0625rem solid var(--this-site-border);
		background:
			radial-gradient(
				circle at top right,
				color-mix(in srgb, white 34%, transparent),
				transparent 45%
			),
			linear-gradient(
				160deg,
				color-mix(in srgb, var(--this-site-bg) 92%, white),
				var(--this-site-bg)
			);
		color: var(--this-site-text);
		box-shadow:
			inset 0 0.0625rem 0 rgba(255, 255, 255, 0.3),
			0 1rem 2.2rem rgba(50, 34, 12, 0.14);
	}

	:global(.dark) .this-site-block {
		--this-site-bg: hsl(194, 73%, 60%);
		--this-site-text: hsl(216, 47%, 14%);
		--this-site-chip-bg: color-mix(in srgb, var(--this-site-text) 14%, white);
		--this-site-border: color-mix(in srgb, var(--this-site-text) 18%, transparent);
		box-shadow:
			inset 0 0.0625rem 0 rgba(255, 255, 255, 0.16),
			0 1rem 2.2rem rgba(9, 28, 42, 0.22);
	}

	.this-site-block__glow {
		position: absolute;
		inset: auto -15% -22% auto;
		width: 11rem;
		height: 11rem;
		border-radius: 50%;
		background: color-mix(in srgb, white 26%, transparent);
		filter: blur(1rem);
		opacity: 0.85;
	}

	.this-site-block__content {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
		height: 100%;
		min-height: 0;
		gap: 0.9rem;
		padding: 0.95rem;
	}

	.this-site-block__copy {
		display: grid;
		align-content: start;
		gap: 0.8rem;
		min-height: 0;
	}

	.this-site-block__title {
		margin: 0;
		max-width: 10ch;
		font-size: clamp(1.5rem, 1.7vw + 1.05rem, 2.2rem);
		line-height: 0.95;
		font-weight: 800;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-wrap: balance;
	}

	.this-site-block__stack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.this-site-block__stack li {
		padding: 0.38rem 0.64rem;
		border: 0.0625rem solid color-mix(in srgb, var(--this-site-text) 16%, transparent);
		border-radius: 999px;
		background: var(--this-site-chip-bg);
		font-size: 0.68rem;
		font-weight: 700;
		line-height: 1;
		color: var(--this-site-text);
		backdrop-filter: blur(0.375rem);
	}
</style>
