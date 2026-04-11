<script lang="ts">
	import { type TopLanguage } from '$lib/github/topLanguages';
	import TopLanguagesLoader from './TopLanguagesLoader.svelte';
	import { getEditorSurfaceContext } from '$lib/components/editor/editorSurfaceContext';
	import { topLanguagesSettings, type TopLanguagesVariant } from '$lib/stores/topLanguages.svelte';
	import { cn } from '$lib/utils';

	interface TopLanguagesProps {
		class?: string;
		variant?: TopLanguagesVariant;
		effectsEnabled?: boolean;
	}

	interface VoronoiCell {
		points: string;
		labelX: number;
		labelY: number;
		rotate?: number;
	}

	let { class: className = '', variant, effectsEnabled = true }: TopLanguagesProps = $props();
	const editorSurface = getEditorSurfaceContext();
	const isEditorSurface = editorSurface?.surface === 'editor';

	let languages = $state<TopLanguage[]>([]);
	let requestFailed = $state(false);

	const loadState = $derived.by(() => {
		if (languages.length > 0) return 'ready';
		if (requestFailed) return 'error';
		return effectsEnabled ? 'loading' : 'idle';
	});

	const resolvedVariant = $derived(variant ?? topLanguagesSettings.variant);
	const displayVariant = $derived.by(() =>
		resolvedVariant === 'voronoi' && languages.length !== 5 ? 'ranked-cards' : resolvedVariant
	);
	const topRow = $derived.by(() => languages.slice(0, 2));
	const bottomRow = $derived.by(() => languages.slice(2));
	const topTotal = $derived.by(() =>
		topRow.reduce((sum, language) => sum + language.percentage, 0)
	);
	const bottomTotal = $derived.by(() =>
		bottomRow.reduce((sum, language) => sum + language.percentage, 0)
	);
	const voronoiCells: VoronoiCell[] = [
		{ points: '0,0 55,0 52,47 32,55 0,50', labelX: 22, labelY: 21 },
		{ points: '55,0 100,0 100,42 92,46 72,50 52,47', labelX: 77, labelY: 22 },
		{ points: '0,50 32,55 38,100 0,100', labelX: 18, labelY: 76 },
		{ points: '32,55 72,50 92,46 92,100 38,100', labelX: 60, labelY: 74 },
		{ points: '92,46 100,42 100,100 92,100', labelX: 96, labelY: 74, rotate: 90 }
	];

	function getWaffleLanguage(square: number) {
		let total = 0;

		for (const language of languages) {
			total += language.percentage;
			if (square <= total) {
				return language;
			}
		}

		return languages[languages.length - 1];
	}

	const waffleCells = $derived.by(() =>
		Array.from({ length: 100 }, (_, index) => getWaffleLanguage(index + 1))
	);
</script>

<div class={cn('top-languages', className)}>
	<div class="top-languages-shell" data-variant={displayVariant}>
		<div class="top-languages-header">
			<span class="top-languages-eyebrow">Programming</span>
			{#if displayVariant === 'voronoi'}
				<p class="top-languages-title">An organic view of the current language mix.</p>
			{/if}
		</div>

		<div class="top-languages-content">
			{#if loadState === 'loading'}
				<TopLanguagesLoader
					onload={(nextLanguages) => {
						languages = nextLanguages;
						requestFailed = false;
					}}
					onerror={() => {
						requestFailed = true;
					}}
				/>
			{/if}

			{#if loadState === 'idle'}
				<div class="loading-state" aria-live="polite">
					<div class="loading-state__copy">
						<span class="loading-state__title">Language mix on standby.</span>
						<span class="loading-state__subtitle">
							{#if isEditorSurface}
								The live GitHub snapshot loads when this tile enters view.
							{:else}
								The latest GitHub snapshot will load when effects resume.
							{/if}
						</span>
					</div>
				</div>
			{:else if loadState === 'loading'}
				<div class="loading-state" aria-live="polite" aria-busy="true">
					<div class="loading-state__copy">
						<span class="loading-state__title">Loading languages...</span>
						<span class="loading-state__subtitle">Pulling the latest mix from GitHub.</span>
					</div>
					<div class="loading-state__bars" aria-hidden="true">
						<span class="loading-bar" style="width: 88%"></span>
						<span class="loading-bar" style="width: 72%"></span>
						<span class="loading-bar" style="width: 61%"></span>
						<span class="loading-bar" style="width: 49%"></span>
						<span class="loading-bar" style="width: 36%"></span>
					</div>
				</div>
			{:else if loadState === 'error'}
				<div class="loading-state" aria-live="polite">
					<div class="loading-state__copy">
						<span class="loading-state__title">Language data unavailable.</span>
						<span class="loading-state__subtitle"
							>GitHub didn&apos;t return language stats just now.</span
						>
					</div>
				</div>
			{:else if displayVariant === 'horizontal-bars'}
				<ol class="bars-list" aria-label="Programming language usage breakdown">
					{#each languages as language, index (language.name)}
						<li
							class="bar-card"
							style="--lang-color: {language.color}; --lang-percent: {language.percentage};"
						>
							<div class="bar-row">
								<div class="bar-copy">
									<span class="bar-rank">{String(index + 1).padStart(2, '0')}</span>
									<span class="bar-name">{language.name}</span>
								</div>
								<span class="bar-pct">{language.percentage}%</span>
							</div>
							<div class="bar-track" aria-hidden="true">
								<span class="bar-fill"></span>
							</div>
						</li>
					{/each}
				</ol>
			{:else if displayVariant === 'treemap'}
				<div class="treemap-layout" aria-label="Programming language treemap">
					<div class="treemap-row" style="flex: {topTotal};">
						{#each topRow as language (language.name)}
							<div
								class="treemap-block"
								style="--lang-color: {language.color}; flex: {language.percentage};"
							>
								<span class="treemap-name">{language.name}</span>
								<span class="treemap-pct">{language.percentage}%</span>
							</div>
						{/each}
					</div>

					<div class="treemap-row" style="flex: {bottomTotal};">
						{#each bottomRow as language (language.name)}
							<div
								class="treemap-block"
								class:treemap-block--rotated={language.percentage < 10}
								style="--lang-color: {language.color}; flex: {language.percentage};"
							>
								<span class="treemap-name">{language.name}</span>
								<span class="treemap-pct">{language.percentage}%</span>
							</div>
						{/each}
					</div>
				</div>
			{:else if displayVariant === 'voronoi'}
				<div class="voronoi-layout">
					<svg
						viewBox="0 0 100 100"
						class="voronoi-chart"
						aria-label="Programming languages as approximate Voronoi cells"
					>
						{#each languages.slice(0, voronoiCells.length) as language, index (language.name)}
							{@const cell = voronoiCells[index]}
							<g style="--lang-color: {language.color};">
								<polygon points={cell.points} class="voronoi-shape" />
								{#if cell.rotate}
									<text
										x={cell.labelX}
										y={cell.labelY}
										class="voronoi-label voronoi-label--small"
										transform={`rotate(${cell.rotate} ${cell.labelX} ${cell.labelY})`}
									>
										<tspan x={cell.labelX} dy="0">{language.name}</tspan>
										<tspan x={cell.labelX} dy="6">{language.percentage}%</tspan>
									</text>
								{:else}
									<text x={cell.labelX} y={cell.labelY} class="voronoi-label">
										<tspan x={cell.labelX} dy="0">{language.name}</tspan>
										<tspan x={cell.labelX} dy="6">{language.percentage}%</tspan>
									</text>
								{/if}
							</g>
						{/each}
					</svg>
					<p class="variant-footnote">Approximate cells tuned to the target percentages.</p>
				</div>
			{:else if displayVariant === 'segmented-bar'}
				<div class="segmented-layout">
					<div class="segmented-bar" aria-hidden="true">
						{#each languages as language (language.name)}
							<div
								class="segmented-segment"
								style="--lang-color: {language.color}; flex: {language.percentage};"
							>
								{#if language.percentage >= 20}
									<span class="segmented-label">{language.name}</span>
								{/if}
							</div>
						{/each}
					</div>

					<ul class="mini-legend">
						{#each languages as language (language.name)}
							<li class="mini-legend-item">
								<span class="mini-legend-dot" style="--lang-color: {language.color};"></span>
								<span class="mini-legend-name">{language.name}</span>
								<span class="mini-legend-pct">{language.percentage}%</span>
							</li>
						{/each}
					</ul>
				</div>
			{:else if displayVariant === 'waffle'}
				<div class="waffle-layout">
					<div class="waffle-grid" aria-hidden="true">
						{#each waffleCells as language, index (index)}
							<span class="waffle-cell" style="--lang-color: {language.color};"></span>
						{/each}
					</div>

					<ul class="mini-legend mini-legend--dense">
						{#each languages as language (language.name)}
							<li class="mini-legend-item">
								<span class="mini-legend-dot" style="--lang-color: {language.color};"></span>
								<span class="mini-legend-name">{language.name}</span>
								<span class="mini-legend-pct">{language.percentage}%</span>
							</li>
						{/each}
					</ul>
				</div>
			{:else}
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
			{/if}
		</div>
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
		font-size: clamp(0.8rem, 1.35vw, 0.98rem);
		line-height: 1.2;
		color: var(--text-primary);
		text-wrap: balance;
	}

	.top-languages-content {
		min-height: 0;
	}

	.loading-state {
		display: grid;
		align-content: center;
		gap: 1rem;
		height: 100%;
		padding: 0.25rem 0;
	}

	.loading-state__copy {
		display: grid;
		gap: 0.25rem;
	}

	.loading-state__title {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.loading-state__subtitle {
		font-size: 0.74rem;
		line-height: 1.35;
		color: var(--text-secondary);
	}

	.loading-state__bars {
		display: grid;
		gap: 0.55rem;
	}

	.loading-bar {
		display: block;
		height: 0.7rem;
		border-radius: 999px;
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--surface-hover) 85%, transparent),
			color-mix(in srgb, var(--border-color) 55%, transparent),
			color-mix(in srgb, var(--surface-hover) 85%, transparent)
		);
		background-size: 200% 100%;
		animation: top-languages-loading 1.4s ease-in-out infinite;
	}

	@keyframes top-languages-loading {
		0% {
			background-position: 200% 0;
		}

		100% {
			background-position: -200% 0;
		}
	}

	.bars-list,
	.language-list,
	.mini-legend {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.bars-list,
	.language-list {
		display: grid;
		height: 100%;
		min-height: 0;
	}

	.bars-list {
		grid-template-rows: repeat(5, minmax(0, 1fr));
		gap: 0.45rem;
	}

	.bar-card,
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

	.bar-row,
	.language-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.75rem;
		min-width: 0;
	}

	.bar-copy,
	.language-meta {
		display: flex;
		align-items: flex-start;
		gap: 0.55rem;
		min-width: 0;
	}

	.bar-rank,
	.language-rank {
		padding-top: 0.1rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.65rem;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		line-height: 1;
		color: color-mix(in srgb, var(--text-muted) 80%, var(--lang-color));
	}

	.bar-name,
	.language-name {
		font-size: clamp(0.72rem, 1.4vw, 0.92rem);
		font-weight: 700;
		line-height: 1.05;
		color: var(--text-primary);
	}

	.bar-pct,
	.language-pct,
	.mini-legend-pct {
		font-family: 'JetBrains Mono', monospace;
		font-variant-numeric: tabular-nums;
	}

	.bar-pct,
	.language-pct {
		font-size: clamp(0.82rem, 1.85vw, 1rem);
		font-weight: 700;
		line-height: 1;
		color: var(--text-primary);
	}

	.bar-track,
	.language-bar {
		height: 0.38rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--lang-color) 14%, var(--page-bg));
		overflow: hidden;
	}

	.bar-fill,
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

	.treemap-layout {
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: 0.95rem;
	}

	.treemap-row {
		display: flex;
		min-height: 0;
	}

	.treemap-block {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.15rem;
		padding: 0.5rem;
		min-width: 0;
		overflow: hidden;
		background: var(--lang-color);
	}

	.treemap-block::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.14), transparent 55%);
	}

	.treemap-name,
	.treemap-pct {
		position: relative;
		color: white;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
	}

	.treemap-name {
		font-size: clamp(0.5rem, 1.4vw, 0.74rem);
		font-weight: 700;
		text-align: center;
		line-height: 1.05;
	}

	.treemap-pct {
		font-family: 'JetBrains Mono', monospace;
		font-size: clamp(0.72rem, 2vw, 1.08rem);
		font-weight: 700;
		line-height: 1;
	}

	.treemap-block--rotated {
		flex-direction: row;
		gap: 0.1rem;
	}

	.treemap-block--rotated .treemap-name,
	.treemap-block--rotated .treemap-pct {
		writing-mode: vertical-rl;
		text-orientation: mixed;
	}

	.voronoi-layout {
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
		gap: 0.45rem;
		height: 100%;
	}

	.voronoi-chart {
		width: 100%;
		height: 100%;
		min-height: 0;
		border-radius: 0.95rem;
		background: color-mix(in srgb, var(--page-bg) 30%, transparent);
	}

	.voronoi-shape {
		fill: var(--lang-color);
		stroke: color-mix(in srgb, var(--card-bg) 75%, white 25%);
		stroke-width: 1.2;
		vector-effect: non-scaling-stroke;
	}

	.voronoi-label {
		fill: white;
		font-size: 5px;
		font-weight: 700;
		text-anchor: middle;
		dominant-baseline: middle;
	}

	.voronoi-label--small {
		font-size: 3.9px;
	}

	.variant-footnote {
		margin: 0;
		font-size: 0.65rem;
		line-height: 1.1;
		color: var(--text-secondary);
	}

	.segmented-layout {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		gap: 0.75rem;
		height: 100%;
	}

	.segmented-bar {
		display: flex;
		overflow: hidden;
		border-radius: 999px;
		min-height: 2.8rem;
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--border-color) 50%, transparent);
	}

	.segmented-segment {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.35rem;
		min-width: 0;
		background: linear-gradient(
			135deg,
			var(--lang-color),
			color-mix(in srgb, var(--lang-color) 72%, white)
		);
	}

	.segmented-label {
		font-size: clamp(0.5rem, 1.2vw, 0.72rem);
		font-weight: 700;
		line-height: 1;
		color: white;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	.mini-legend {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.5rem 0.65rem;
		align-content: start;
	}

	.mini-legend--dense {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.mini-legend-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		min-width: 0;
	}

	.mini-legend-dot {
		width: 0.65rem;
		height: 0.65rem;
		border-radius: 999px;
		background: var(--lang-color);
		flex-shrink: 0;
	}

	.mini-legend-name {
		min-width: 0;
		font-size: 0.72rem;
		font-weight: 600;
		line-height: 1.1;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.mini-legend-pct {
		margin-left: auto;
		font-size: 0.7rem;
		color: var(--text-secondary);
	}

	.waffle-layout {
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
		gap: 0.7rem;
		height: 100%;
	}

	.waffle-grid {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		gap: 0.18rem;
		align-content: start;
	}

	.waffle-cell {
		aspect-ratio: 1;
		border-radius: 0.2rem;
		background: var(--lang-color);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24);
	}

	.language-list {
		grid-template-rows: repeat(5, minmax(0, 1fr));
		gap: 0.5rem;
	}

	.language-copy {
		display: flex;
		flex-direction: column;
		gap: 0.12rem;
		min-width: 0;
	}

	.language-note {
		font-size: clamp(0.58rem, 1.05vw, 0.72rem);
		line-height: 1.2;
		color: var(--text-secondary);
		text-wrap: balance;
	}
</style>
