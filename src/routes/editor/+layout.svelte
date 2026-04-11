<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { Header, HeaderLogo, HeaderNav, HeaderNavItem } from '$lib/components/ui/header';
	import { ThemeToggle } from '$lib/components/ui';
	import { hydrateEditorDrafts } from './sharedDrafts.svelte';

	let { data, children } = $props();

	$effect.pre(() => {
		if (browser && dev) {
			hydrateEditorDrafts(data);
		}
	});

	onMount(() => {
		if (!dev) {
			goto(resolve('/'), { replaceState: true });
		}
	});
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
				<a
					href={resolve('/editor/grid')}
					class="section-tab style-none"
					class:active={page.route.id === '/editor/grid'}
					data-sveltekit-preload-data="tap"
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
				</a>
				<a
					href={resolve('/editor/content')}
					class="section-tab style-none"
					class:active={page.route.id === '/editor/content'}
					data-sveltekit-preload-data="tap"
				>
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
						<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
					</svg>
					Content
				</a>
				<a
					href={resolve('/editor/theme')}
					class="section-tab style-none"
					class:active={page.route.id === '/editor/theme'}
					data-sveltekit-preload-data="tap"
				>
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="4" />
						<path
							d="M12 2v2m0 16v2m10-10h-2M4 12H2m17.07 7.07-1.41-1.41M6.34 6.34 4.93 4.93m14.14 0-1.41 1.41M6.34 17.66l-1.41 1.41"
						/>
					</svg>
					Theme
				</a>
				<a
					href={resolve('/editor/analytics')}
					class="section-tab style-none"
					class:active={page.route.id === '/editor/analytics'}
					data-sveltekit-preload-data="tap"
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
				</a>
				<a
					href={resolve('/editor/visitors')}
					class="section-tab style-none"
					class:active={page.route.id === '/editor/visitors'}
					data-sveltekit-preload-data="tap"
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
				</a>
				<a
					href={resolve('/editor/settings')}
					class="section-tab style-none"
					class:active={page.route.id === '/editor/settings'}
					data-sveltekit-preload-data="tap"
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
				</a>
			</nav>

			<div class="editor-content">
				{@render children()}
			</div>
		</div>
	</div>
{:else}
	{@render children()}
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
		text-decoration: none;
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
		color: hsl(0, 0%, 100%);
		background: var(--caroline-blue-700);
		font-weight: 600;
		box-shadow:
			0 0.0625rem 0.125rem rgba(0, 0, 0, 0.12),
			0 0 0 0.0625rem color-mix(in srgb, var(--liver-brown-900) 22%, transparent);
	}

	.section-tab.active:hover {
		color: hsl(0, 0%, 100%);
		background: var(--caroline-blue-600);
	}
</style>
