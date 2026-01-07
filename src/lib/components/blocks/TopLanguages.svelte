<script lang="ts">
	import { cn } from "$lib/utils";

	interface TopLanguagesProps {
		class?: string;
	}

	let { class: className = '' }: TopLanguagesProps = $props();

	const languages = [
		{ name: 'Svelte', percentage: 30, color: 'var(--lang-svelte)' },
		{ name: 'TypeScript', percentage: 25, color: 'var(--lang-typescript)' },
		{ name: 'Rust', percentage: 20, color: 'var(--lang-rust)' },
		{ name: 'Elixir', percentage: 20, color: 'var(--lang-elixir)' },
		{ name: 'Haskell', percentage: 5, color: 'var(--lang-haskell)' },
	];
</script>

<div class={cn("vintage-ad relative overflow-hidden", className)}>
	<div class="ad-frame">
		<div class="ad-content">
			<div class="top-banner">
				<span class="banner-wing">★ ★ ★</span>
				<span class="banner-text">SINCE 2018</span>
				<span class="banner-wing">★ ★ ★</span>
			</div>

			<!-- Main headline -->
			<header class="headline-section">
				<div class="pre-headline">The Developer's Choice!</div>
				<h3 class="main-headline">TOP LANGUAGES</h3>
				<div class="headline-underline"></div>
			</header>

			<div class="languages-list">
				{#each languages as language, i (language.name)}
					<div class="language-row" style="--lang-color: {language.color};">
						<div class="rank-badge">№{i + 1}</div>
						<div class="language-info">
							<span class="language-name">{language.name}</span>
							<div class="progress-bar">
								<div class="progress-fill" style="width: {language.percentage}%;"></div>
							</div>
						</div>
						<div class="percentage-badge">{language.percentage}%</div>
					</div>
				{/each}
			</div>

			<div class="bottom-divider">
				<span class="divider-dot">◆</span>
				<span class="divider-line"></span>
				<span class="divider-dot">◆</span>
			</div>
		</div>
	</div>
</div>

<style>
	.vintage-ad {
		min-height: 16.25rem;
	}

	.ad-frame {
		background: var(--surface, var(--sandy-tan-200));
		border: 0.125rem solid var(--border-color);
		border-radius: 0.375rem;
		padding: 0.1875rem;
		height: 100%;
		box-shadow: 
			inset 0 0 0 0.0625rem var(--transit-yellow-600),
			0.1875rem 0.1875rem 0 rgba(0,0,0,0.1);
		position: relative;
	}

	.ad-frame::before {
		content: '';
		position: absolute;
		inset: 0.375rem;
		border: 0.0625rem dashed var(--border-color);
		opacity: 0.25;
		pointer-events: none;
	}

	.ad-content {
		background: var(--card-bg, var(--sandy-tan-300));
		padding: 0.875rem 0.75rem;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.top-banner {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 0.375rem;
	}

	.banner-wing {
		font-size: 0.4375rem;
		color: var(--transit-yellow-800);
		letter-spacing: 0.125rem;
	}

	.banner-text {
		font-size: 0.5625rem;
		font-weight: 600;
		letter-spacing: 0.125rem;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.headline-section {
		text-align: center;
		margin-bottom: 0.625rem;
	}

	.pre-headline {
		font-size: 0.625rem;
		font-style: italic;
		color: var(--text-secondary);
		margin-bottom: 0.125rem;
	}

	.main-headline {
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: 0.1875rem;
		text-transform: uppercase;
		color: var(--text-primary);
		margin: 0;
		line-height: 1;
	}

	.headline-underline {
		width: 70%;
		height: 0.125rem;
		background: linear-gradient(90deg, transparent, var(--border-color), transparent);
		margin: 0.375rem auto 0;
	}

	.languages-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.3125rem;
	}

	.language-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.3125rem 0.375rem;
		background: color-mix(in srgb, var(--surface) 60%, transparent);
		border: 0.0625rem solid color-mix(in srgb, var(--border-color) 30%, transparent);
		border-radius: 0.25rem;
		transition: all 0.15s ease;
	}

	.language-row:hover {
		background: var(--surface-hover);
		border-color: var(--lang-color);
	}

	.rank-badge {
		font-size: 0.625rem;
		font-weight: 600;
		color: var(--text-muted);
		min-width: 1.25rem;
	}

	.language-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.1875rem;
	}

	.language-name {
		font-weight: 600;
		font-size: 0.75rem;
		color: var(--text-primary);
		letter-spacing: 0.01875rem;
	}

	.progress-bar {
		height: 0.25rem;
		background: color-mix(in srgb, var(--border-color) 30%, transparent);
		border-radius: 0.125rem;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--lang-color);
		border-radius: 0.125rem;
		transition: width 0.4s ease;
	}

	.percentage-badge {
		font-size: 0.6875rem;
		font-weight: 700;
		color: var(--text-secondary);
		min-width: 2rem;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.bottom-divider {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 0.625rem;
	}

	.divider-dot {
		font-size: 0.3125rem;
		color: var(--transit-yellow-700);
	}

	.divider-line {
		width: 2.5rem;
		height: 0.0625rem;
		background: var(--border-color);
		opacity: 0.3;
	}
</style>
