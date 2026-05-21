<script lang="ts">
	import { onMount } from 'svelte';
	import type { ChangelogEntry, ChangelogResponse } from '$lib/types/changelog';

	type Props = {
		class?: string;
	};

	let { class: className = '' }: Props = $props();
	let commits = $state<ChangelogEntry[]>([]);
	let repositoryUrl = $state<string | null>(null);
	let loadState = $state<'loading' | 'ready' | 'error'>('loading');

	function formatCommitDate(isoDate: string) {
		const date = new Date(isoDate);

		return new Intl.DateTimeFormat(undefined, {
			month: 'short',
			day: 'numeric'
		}).format(date);
	}

	onMount(() => {
		const controller = new AbortController();

		void (async () => {
			try {
				const response = await fetch('/api/github/changelog', {
					signal: controller.signal
				});

				if (!response.ok) {
					loadState = 'error';
					return;
				}

				const payload = (await response.json()) as ChangelogResponse;
				commits = payload.commits;
				repositoryUrl = payload.repository.url;
				loadState = payload.commits.length > 0 ? 'ready' : 'error';
			} catch (error) {
				if (error instanceof DOMException && error.name === 'AbortError') {
					return;
				}

				console.error('Failed to load GitHub changelog:', error);
				loadState = 'error';
			}
		})();

		return () => {
			controller.abort();
		};
	});
</script>

<section class={['changelog-block', className]} aria-labelledby="changelog-block-heading">
	<header class="changelog-block__header">
		<h2 id="changelog-block-heading" class="changelog-block__title">changelog</h2>
		{#if repositoryUrl}
			<a class="changelog-block__repo-link" href={repositoryUrl} rel="noopener noreferrer" target="_blank">
				github
			</a>
		{/if}
	</header>

	<div class="changelog-block__body">
		{#if loadState === 'loading'}
			<p class="changelog-block__status" aria-live="polite">loading recent commits…</p>
		{:else if loadState === 'error'}
			<p class="changelog-block__status">couldn't load commits right now.</p>
		{:else}
			<ol class="changelog-block__list">
				{#each commits as commit (commit.sha)}
					<li class="changelog-block__item">
						<a class="changelog-block__entry" href={commit.url} rel="noopener noreferrer" target="_blank">
							<span class="changelog-block__type" data-type={commit.type}>{commit.type}</span>
							<span class="changelog-block__content">
								<span class="changelog-block__message">{commit.message}</span>
								<span class="changelog-block__meta">
									<span class="changelog-block__date">{formatCommitDate(commit.date)}</span>
									<span class="changelog-block__sha" aria-label="commit {commit.shortSha}">{commit.shortSha}</span>
								</span>
							</span>
						</a>
					</li>
				{/each}
			</ol>
		{/if}
	</div>
</section>

<style>
	.changelog-block {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		height: 100%;
		min-height: inherit;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--border-color) 58%, transparent);
		border-radius: inherit;
		background-color: var(--card-bg);
		color: var(--text-primary);
	}

	.changelog-block__header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 1rem 1rem 0.75rem;
		border-bottom: 1px solid color-mix(in srgb, var(--border-color) 42%, transparent);
	}

	.changelog-block__title {
		margin: 0;
		font-family: var(--font-pixel), var(--font-sans);
		font-size: 0.95rem;
		font-weight: 400;
		line-height: 1.2;
		text-transform: lowercase;
	}

	.changelog-block__repo-link {
		font-family: var(--font-pixel), var(--font-sans);
		font-size: 0.72rem;
		color: var(--text-secondary);
		text-decoration: none;
		text-transform: lowercase;
	}

	.changelog-block__repo-link:hover,
	.changelog-block__repo-link:focus-visible {
		color: var(--text-primary);
		text-decoration: underline;
	}

	.changelog-block__body {
		min-height: 0;
		overflow: auto;
		padding: 0.35rem 0.5rem 0.75rem;
		scrollbar-width: thin;
	}

	.changelog-block__status {
		margin: 0.75rem 0.5rem;
		font-family: var(--font-pixel), var(--font-sans);
		font-size: 0.78rem;
		color: var(--text-secondary);
		text-transform: lowercase;
	}

	.changelog-block__list {
		display: grid;
		gap: 0.35rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.changelog-block__entry {
		display: grid;
		grid-template-columns: minmax(3.5rem, auto) minmax(0, 1fr);
		gap: 0.55rem;
		align-items: start;
		padding: 0.55rem 0.5rem;
		border-radius: 0.65rem;
		color: inherit;
		text-decoration: none;
		transition: background-color 140ms ease;
	}

	.changelog-block__entry:hover,
	.changelog-block__entry:focus-visible {
		background: color-mix(in srgb, var(--border-color) 18%, transparent);
		outline: none;
	}

	.changelog-block__type {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 1.35rem;
		padding: 0.1rem 0.35rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--border-color) 55%, transparent);
		background: color-mix(in srgb, var(--border-color) 12%, transparent);
		font-family: var(--font-pixel), var(--font-sans);
		font-size: 0.58rem;
		line-height: 1.2;
		color: var(--text-secondary);
		text-transform: lowercase;
		white-space: nowrap;
	}

	.changelog-block__type[data-type='feature'] {
		color: color-mix(in srgb, var(--caroline-blue-600) 88%, var(--text-primary));
		border-color: color-mix(in srgb, var(--caroline-blue-600) 35%, transparent);
		background: color-mix(in srgb, var(--caroline-blue-600) 12%, transparent);
	}

	.changelog-block__type[data-type='fix'] {
		color: color-mix(in srgb, #c2410c 88%, var(--text-primary));
		border-color: color-mix(in srgb, #c2410c 35%, transparent);
		background: color-mix(in srgb, #c2410c 12%, transparent);
	}

	.changelog-block__content {
		display: grid;
		gap: 0.2rem;
		min-width: 0;
	}

	.changelog-block__meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.changelog-block__date {
		font-family: var(--font-pixel), var(--font-sans);
		font-size: 0.62rem;
		line-height: 1.35;
		color: var(--text-secondary);
		text-transform: lowercase;
		white-space: nowrap;
	}

	.changelog-block__message {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		line-height: 1.35;
		overflow-wrap: anywhere;
	}

	.changelog-block__sha {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.68rem;
		line-height: 1.35;
		color: var(--text-secondary);
		white-space: nowrap;
	}
</style>
