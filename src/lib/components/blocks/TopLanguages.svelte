<script lang="ts">
	import { cn } from '$lib/utils';

	interface TopLanguagesProps {
		class?: string;
	}

	interface Language {
		name: string;
		percentage: number;
		color: string;
		note: string;
	}

	let { class: className = '' }: TopLanguagesProps = $props();

	const languages: Language[] = [
		{
			name: 'Svelte',
			percentage: 30,
			color: 'var(--lang-svelte)',
			note: 'interfaces, motion, and design systems'
		},
		{
			name: 'TypeScript',
			percentage: 25,
			color: 'var(--lang-typescript)',
			note: 'component APIs, tooling, and app glue'
		},
		{
			name: 'Rust',
			percentage: 20,
			color: 'var(--lang-rust)',
			note: 'CLIs, experiments, and performance rabbit holes'
		},
		{
			name: 'Elixir',
			percentage: 20,
			color: 'var(--lang-elixir)',
			note: 'realtime backends and durable app logic'
		},
		{
			name: 'Haskell',
			percentage: 5,
			color: 'var(--lang-haskell)',
			note: 'type-driven side quests'
		}
	];
</script>

<div class={cn('top-languages', className)}>
	<div class="top-languages-shell">
		<div class="top-languages-header">
			<span class="top-languages-eyebrow">Programming</span>
			<p class="top-languages-title">Languages I reach for most often.</p>
		</div>

		<ol class="language-list" aria-label="Programming language usage breakdown">
			{#each languages as language, index (language.name)}
				<li
					class="language-card"
					style="--lang-color: {language.color}; --lang-percent: {language.percentage};"
				>
					<div class="language-row">
						<div class="language-meta">
							<span class="language-rank">{String(index + 1).padStart(2, '0')}</span>
							<div class="language-copy">
								<span class="language-name">{language.name}</span>
								<span class="language-note">{language.note}</span>
							</div>
						</div>

						<span class="language-pct">{language.percentage}%</span>
					</div>

					<div class="language-bar" aria-hidden="true">
						<span class="language-bar-fill"></span>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</div>

<style>
	.top-languages {
		height: 100%;
		width: 100%;
		min-width: 0;
	}

	.top-languages-shell {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		gap: 0.75rem;
		height: 100%;
		padding: 0.875rem;
		border: 1px solid color-mix(in srgb, var(--border-color) 60%, transparent);
		border-radius: 1rem;
		background:
			radial-gradient(
				circle at top right,
				color-mix(in srgb, var(--surface-hover) 75%, transparent),
				transparent 38%
			),
			linear-gradient(180deg, color-mix(in srgb, var(--card-bg) 90%, white 10%), var(--card-bg));
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
	}

	.top-languages-header {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.top-languages-eyebrow {
		font-size: 0.65rem;
		font-weight: 700;
		line-height: 1;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.top-languages-title {
		margin: 0;
		font-size: clamp(0.8rem, 1.4vw, 1rem);
		line-height: 1.2;
		color: var(--text-primary);
		text-wrap: balance;
	}

	.language-list {
		list-style: none;
		display: grid;
		grid-template-rows: repeat(5, minmax(0, 1fr));
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		min-height: 0;
	}

	.language-card {
		display: grid;
		grid-template-rows: auto auto;
		gap: 0.4rem;
		padding: 0.6rem 0.7rem;
		border-radius: 0.85rem;
		border: 1px solid color-mix(in srgb, var(--lang-color) 28%, transparent);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--lang-color) 16%, var(--card-bg)),
			color-mix(in srgb, var(--lang-color) 7%, var(--card-bg))
		);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
		min-width: 0;
	}

	.language-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.75rem;
		min-width: 0;
	}

	.language-meta {
		display: flex;
		align-items: flex-start;
		gap: 0.55rem;
		min-width: 0;
	}

	.language-rank {
		padding-top: 0.1rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.65rem;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		line-height: 1;
		color: color-mix(in srgb, var(--text-muted) 80%, var(--lang-color));
	}

	.language-copy {
		display: flex;
		flex-direction: column;
		gap: 0.12rem;
		min-width: 0;
	}

	.language-name {
		font-size: clamp(0.72rem, 1.4vw, 0.92rem);
		font-weight: 700;
		line-height: 1.05;
		color: var(--text-primary);
	}

	.language-note {
		font-size: clamp(0.58rem, 1.05vw, 0.72rem);
		line-height: 1.2;
		color: var(--text-secondary);
		text-wrap: balance;
	}

	.language-pct {
		font-family: 'JetBrains Mono', monospace;
		font-size: clamp(0.82rem, 1.9vw, 1rem);
		font-variant-numeric: tabular-nums;
		font-weight: 700;
		line-height: 1;
		color: var(--text-primary);
	}

	.language-bar {
		height: 0.38rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--lang-color) 14%, var(--page-bg));
		overflow: hidden;
	}

	.language-bar-fill {
		display: block;
		height: 100%;
		width: calc(var(--lang-percent) * 1%);
		border-radius: inherit;
		background: linear-gradient(
			90deg,
			var(--lang-color),
			color-mix(in srgb, var(--lang-color) 72%, white)
		);
	}
</style>
