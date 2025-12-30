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
			<!-- Top banner -->
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

			<!-- Language listings -->
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

			<!-- Bottom divider -->
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
		min-height: 260px;
	}

	.ad-frame {
		background: var(--surface, var(--sandy-tan-200));
		border: 2px solid var(--border-color);
		border-radius: 6px;
		padding: 3px;
		height: 100%;
		box-shadow: 
			inset 0 0 0 1px var(--transit-yellow-600),
			3px 3px 0 rgba(0,0,0,0.1);
		position: relative;
	}

	.ad-frame::before {
		content: '';
		position: absolute;
		inset: 6px;
		border: 1px dashed var(--border-color);
		opacity: 0.25;
		pointer-events: none;
	}

	.ad-content {
		background: var(--card-bg, var(--sandy-tan-300));
		padding: 14px 12px;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.top-banner {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-bottom: 6px;
	}

	.banner-wing {
		font-size: 7px;
		color: var(--transit-yellow-800);
		letter-spacing: 2px;
	}

	.banner-text {
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.headline-section {
		text-align: center;
		margin-bottom: 10px;
	}

	.pre-headline {
		font-size: 10px;
		font-style: italic;
		color: var(--text-secondary);
		margin-bottom: 2px;
	}

	.main-headline {
		font-size: 20px;
		font-weight: 700;
		letter-spacing: 3px;
		text-transform: uppercase;
		color: var(--text-primary);
		margin: 0;
		line-height: 1;
	}

	.headline-underline {
		width: 70%;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--border-color), transparent);
		margin: 6px auto 0;
	}

	.languages-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.language-row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 5px 6px;
		background: color-mix(in srgb, var(--surface) 60%, transparent);
		border: 1px solid color-mix(in srgb, var(--border-color) 30%, transparent);
		border-radius: 4px;
		transition: all 0.15s ease;
	}

	.language-row:hover {
		background: var(--surface-hover);
		border-color: var(--lang-color);
	}

	.rank-badge {
		font-size: 10px;
		font-weight: 600;
		color: var(--text-muted);
		min-width: 20px;
	}

	.language-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.language-name {
		font-weight: 600;
		font-size: 12px;
		color: var(--text-primary);
		letter-spacing: 0.3px;
	}

	.progress-bar {
		height: 4px;
		background: color-mix(in srgb, var(--border-color) 30%, transparent);
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--lang-color);
		border-radius: 2px;
		transition: width 0.4s ease;
	}

	.percentage-badge {
		font-size: 11px;
		font-weight: 700;
		color: var(--text-secondary);
		min-width: 32px;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.bottom-divider {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-top: 10px;
	}

	.divider-dot {
		font-size: 5px;
		color: var(--transit-yellow-700);
	}

	.divider-line {
		width: 40px;
		height: 1px;
		background: var(--border-color);
		opacity: 0.3;
	}
</style>
