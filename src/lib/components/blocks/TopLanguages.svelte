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

	// Simple treemap: top row gets first 2 (55%), bottom row gets last 3 (45%)
	const topRow = languages.slice(0, 2);
	const bottomRow = languages.slice(2);
	const topTotal = topRow.reduce((sum, l) => sum + l.percentage, 0);
	const bottomTotal = bottomRow.reduce((sum, l) => sum + l.percentage, 0);
</script>

<div class={cn("lang-grid-container", className)}>
	<div class="lang-row" style="flex: {topTotal};">
		{#each topRow as language (language.name)}
			<div 
				class="lang-block"
				class:rotated={language.percentage < 10}
				style="--lang-color: {language.color}; flex: {language.percentage};"
			>
				<span class="lang-name">{language.name}</span>
				<span class="lang-pct">{language.percentage}%</span>
			</div>
		{/each}
	</div>
	<div class="lang-row" style="flex: {bottomTotal};">
		{#each bottomRow as language (language.name)}
			<div 
				class="lang-block"
				class:rotated={language.percentage < 10}
				style="--lang-color: {language.color}; flex: {language.percentage};"
			>
				<span class="lang-name">{language.name}</span>
				<span class="lang-pct">{language.percentage}%</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.lang-grid-container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.lang-row {
		display: flex;
		min-height: 0;
	}

	.lang-block {
		background: var(--lang-color);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.125rem;
		padding: 0.5rem;
		cursor: default;
		position: relative;
		overflow: hidden;
		min-width: 0;
	}

	.lang-block::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%);
		pointer-events: none;
	}

	.lang-name {
		font-size: clamp(0.5rem, 1.5vw, 0.75rem);
		font-weight: 600;
		color: white;
		text-shadow: 0 1px 2px rgba(0,0,0,0.3);
		text-align: center;
		line-height: 1.1;
		letter-spacing: 0.02em;
	}

	.lang-pct {
		font-size: clamp(0.75rem, 2.5vw, 1.25rem);
		font-weight: 700;
		color: white;
		text-shadow: 0 1px 2px rgba(0,0,0,0.3);
		font-variant-numeric: tabular-nums;
		font-family: 'JetBrains Mono', monospace;
	}

	.rotated {
		flex-direction: row;
	}

	.rotated .lang-name,
	.rotated .lang-pct {
		writing-mode: vertical-rl;
		text-orientation: mixed;
	}
</style>
