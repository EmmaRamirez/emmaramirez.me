<script lang="ts">
	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle } from '$lib/components/ui';
	import EditorGridSection from '$lib/components/editor/EditorGridSection.svelte';

	onMount(() => {
		if (!dev) {
			goto(resolve('/'), { replaceState: true });
		}
	});

	let activeSection = $state<'grid' | 'settings'>('grid');
</script>

{#if dev}
	<div class="editor-container min-h-screen bg-(--background)">
		<Header sticky>
			<HeaderLogo>
				<span class="flex items-center gap-2">
					EMZINNIA
					<span class="rounded-md bg-amber-500/20 px-2 py-0.5 font-mono text-xs text-amber-400">
						EDITOR
					</span>
				</span>
			</HeaderLogo>
			<HeaderNav>
				<HeaderNavItem href="/" class="text-(--text-secondary)">← Back to Site</HeaderNavItem>
				<ThemeToggle class="ml-2" />
			</HeaderNav>
		</Header>

		<div class="editor-layout mx-auto max-w-7xl px-4 py-8">
			<nav class="mb-8 flex gap-1 rounded-xl bg-(--surface) p-1.5" aria-label="Editor sections">
				<button
					type="button"
					class="section-tab"
					class:active={activeSection === 'grid'}
					onclick={() => (activeSection = 'grid')}
				>
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<rect x="3" y="3" width="7" height="7" rx="1" />
						<rect x="14" y="3" width="7" height="7" rx="1" />
						<rect x="3" y="14" width="7" height="7" rx="1" />
						<rect x="14" y="14" width="7" height="7" rx="1" />
					</svg>
					Grid
				</button>
				<button
					type="button"
					class="section-tab"
					class:active={activeSection === 'settings'}
					onclick={() => (activeSection = 'settings')}
					disabled
				>
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="3" />
						<path
							d="M12 1v4m0 14v4M4.22 4.22l2.83 2.83m9.9 9.9l2.83 2.83M1 12h4m14 0h4M4.22 19.78l2.83-2.83m9.9-9.9l2.83-2.83"
						/>
					</svg>
					Settings
					<span class="ml-1 text-xs opacity-50">(soon)</span>
				</button>
			</nav>

			<div class="editor-content">
				{#if activeSection === 'grid'}
					<EditorGridSection />
				{:else if activeSection === 'settings'}
					<div class="coming-soon">
						<p>Settings coming soon</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<p class="text-(--text-muted)">This page is only available in development mode.</p>
	</div>
{/if}

<style>
	.section-tab {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		border-radius: 0.625rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.section-tab:hover:not(:disabled) {
		color: var(--text-primary);
		background: var(--surface-hover);
	}

	.section-tab:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.section-tab.active {
		color: var(--text-primary);
		background: var(--background);
		box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.1);
	}

	.coming-soon {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 25rem;
		border-radius: 1rem;
		border: 0.125rem dashed var(--border-color);
		color: var(--text-muted);
	}
</style>
