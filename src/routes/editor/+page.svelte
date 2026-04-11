<script lang="ts">
	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle } from '$lib/components/ui';
	import EditorAnalyticsSection from '$lib/components/editor/EditorAnalyticsSection.svelte';
	import EditorGridSection from '$lib/components/editor/EditorGridSection.svelte';
	import EditorSettingsSection from '$lib/components/editor/EditorSettingsSection.svelte';
	import EditorThemeSection from '$lib/components/editor/EditorThemeSection.svelte';
	import EditorVisitorsSection from '$lib/components/editor/EditorVisitorsSection.svelte';

	onMount(() => {
		if (!dev) {
			goto(resolve('/'), { replaceState: true });
		}
	});

	let activeSection = $state<'grid' | 'theme' | 'settings' | 'analytics' | 'visitors'>('grid');
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
					class:active={activeSection === 'theme'}
					onclick={() => (activeSection = 'theme')}
				>
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2m0 16v2m10-10h-2M4 12H2m17.07 7.07-1.41-1.41M6.34 6.34 4.93 4.93m14.14 0-1.41 1.41M6.34 17.66l-1.41 1.41" />
					</svg>
					Theme
				</button>
				<button
					type="button"
					class="section-tab"
					class:active={activeSection === 'analytics'}
					onclick={() => (activeSection = 'analytics')}
				>
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M4 19h16" />
						<path d="M7 15v-4" />
						<path d="M12 15V9" />
						<path d="M17 15V5" />
					</svg>
					Analytics
				</button>
				<button
					type="button"
					class="section-tab"
					class:active={activeSection === 'visitors'}
					onclick={() => (activeSection = 'visitors')}
				>
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
						<circle cx="9" cy="7" r="4" />
						<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
						<path d="M16 3.13a4 4 0 0 1 0 7.75" />
					</svg>
					Visitors
				</button>
				<button
					type="button"
					class="section-tab"
					class:active={activeSection === 'settings'}
					onclick={() => (activeSection = 'settings')}
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
				</button>
			</nav>

			<div class="editor-content">
				{#if activeSection === 'grid'}
					<EditorGridSection />
				{:else if activeSection === 'theme'}
					<EditorThemeSection />
				{:else if activeSection === 'analytics'}
					<EditorAnalyticsSection />
				{:else if activeSection === 'visitors'}
					<EditorVisitorsSection />
				{:else if activeSection === 'settings'}
					<EditorSettingsSection />
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

</style>
