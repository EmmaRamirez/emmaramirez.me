<script lang="ts">
	type Panel = {
		eyebrow: string;
		title: string;
		token: string;
	};

	type Props = {
		class?: string;
	};

	const panels: Panel[] = [
		{
			eyebrow: 'Mint',
			title: 'Collected sparks',
			token: 'var(--magic-mint-500)'
		},
		{
			eyebrow: 'Blush',
			title: 'In progress',
			token: 'var(--blush-pink-500)'
		}
	];

	let { class: className = '' }: Props = $props();
</script>

<div class={['subgrid-block', className]}>
	<div class="subgrid-block__panels" aria-label="Two connected color blocks">
		{#each panels as panel (panel.title)}
			<section class="subgrid-block__panel" style:--panel-color={panel.token}>
				<p class="subgrid-block__eyebrow">{panel.eyebrow}</p>
				<h3>{panel.title}</h3>
			</section>
		{/each}
	</div>
</div>

<style>
	.subgrid-block {
		display: grid;
		min-height: min(28rem, calc(120vw - 2rem));
		min-width: 0;
		gap: 1rem;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--border-color) 58%, transparent);
		border-radius: 1.5rem;
		background:
			radial-gradient(
				circle at 20% 18%,
				color-mix(in srgb, var(--magic-mint-500) 34%, transparent),
				transparent 11rem
			),
			radial-gradient(
				circle at 82% 82%,
				color-mix(in srgb, var(--blush-pink-500) 34%, transparent),
				transparent 12rem
			),
			var(--card-bg);
		color: var(--text-primary);
		padding: 1rem;
	}

	.subgrid-block__eyebrow {
		margin: 0;
		color: var(--text-secondary);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.subgrid-block h3 {
		margin: 0;
		font-family: 'DM Serif Text', serif;
		font-weight: 400;
		line-height: 0.95;
	}

	.subgrid-block h3 {
		font-size: clamp(1.45rem, 5vw, 2rem);
	}

	.subgrid-block__panels {
		display: grid;
		gap: 0.85rem;
	}

	.subgrid-block__panel {
		display: grid;
		gap: 0.7rem;
		min-width: 0;
		border: 1px solid color-mix(in srgb, var(--panel-color) 44%, var(--border-color));
		border-radius: 1.1rem;
		background:
			linear-gradient(
				145deg,
				color-mix(in srgb, var(--panel-color) 56%, var(--card-bg)),
				color-mix(in srgb, var(--panel-color) 16%, var(--card-bg))
			);
		padding: 1rem;
		box-shadow: inset 0 0 0 1px color-mix(in srgb, white 28%, transparent);
	}

	@media (min-width: 48rem) {
		.subgrid-block {
			height: 100%;
			min-height: 100%;
			padding: 0.85rem;
		}

		.subgrid-block__panels {
			display: grid;
			grid-template-rows: repeat(2, auto auto minmax(0, 1fr));
		}

		.subgrid-block__panel {
			grid-row: span 3;
			grid-template-rows: subgrid;
			align-content: start;
			padding: 0.85rem;
		}
	}
</style>
