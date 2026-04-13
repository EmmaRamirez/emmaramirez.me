<script lang="ts">
	import { onMount } from 'svelte';
	import { ThisSiteBlock } from '$lib/components/blocks';
	import { buildHomepageGridItems } from '$lib/registry/gridItems';
	import {
		blogSettings,
		thisSiteSettings,
		showSections,
		topLanguagesSettings,
		topLanguagesVariantOptions,
		defaultThisSiteTitle,
		type BlogTagView,
		type TopLanguagesVariant
	} from '$lib/stores/userSettings.svelte';
	import { editorGridLayoutStore } from '$lib/stores/gridLayoutStore.svelte';
	import { Input, Select, Switch } from '$lib/components/ui';

	const blogViewOptions = [
		{ value: 'flat', label: 'Flat Tags' },
		{ value: 'web', label: 'Tag Web' }
	] satisfies Array<{ value: BlogTagView; label: string }>;

	let showSectionsEnabled = $state(false);
	let thisSiteTitle = $state(thisSiteSettings.title);
	let resetStatus = $state<'idle' | 'done'>('idle');

	onMount(() => {
		const unsubscribeShowSections = showSections.subscribe((value) => {
			showSectionsEnabled = value;
		});

		return () => {
			unsubscribeShowSections();
		};
	});

	function toggleHomepageSections() {
		showSections.set(!showSectionsEnabled);
	}

	function handleTopLanguagesVariantChange(event: Event) {
		topLanguagesSettings.variant = (event.currentTarget as HTMLSelectElement)
			.value as TopLanguagesVariant;
	}

	function handleBlogTagViewChange(event: Event) {
		blogSettings.tagView = (event.currentTarget as HTMLSelectElement).value as BlogTagView;
	}

	function handleThisSiteTitleInput() {
		const nextTitle = thisSiteTitle.trim();
		if (nextTitle.length > 0) {
			thisSiteSettings.title = nextTitle;
		}
	}

	function commitThisSiteTitle() {
		thisSiteSettings.title = thisSiteTitle;
		thisSiteTitle = thisSiteSettings.title;
	}

	function resetHomepageLayout() {
		editorGridLayoutStore.reset(buildHomepageGridItems({ includeApiExplorer: true }));
		resetStatus = 'done';

		setTimeout(() => {
			resetStatus = 'idle';
		}, 1800);
	}
</script>

<section class="settings-section">
	<header class="settings-hero">
		<div>
			<h2 class="settings-hero__title">User Settings</h2>
			<p class="settings-hero__body">
				Centralized defaults for the site experience. Theme now has its own dedicated editor
				section, while visual authoring and debug tuning still live in Grid.
			</p>
		</div>
		<span class="settings-hero__pill">Shared</span>
	</header>

	<div class="settings-grid">
		<div class="settings-card">
			<div class="settings-card__header">
				<div>
					<p class="settings-card__title">Homepage</p>
					<p class="settings-card__subtitle">Defaults for the main site surface</p>
				</div>
			</div>

			<div class="settings-card__stack">
				<Switch
					label="Show Essays & Projects"
					description="Controls the homepage navigation and grid visibility."
					checked={showSectionsEnabled}
					on:click={toggleHomepageSections}
				/>

				<Select
					label="Top Languages View"
					value={topLanguagesSettings.variant}
					onchange={handleTopLanguagesVariantChange}
					options={topLanguagesVariantOptions}
					hint="Sets the default treatment for the Top Languages card."
				/>

				<Input
					label="This Site Card Title"
					bind:value={thisSiteTitle}
					oninput={handleThisSiteTitleInput}
					onblur={commitThisSiteTitle}
					hint={`Falls back to "${defaultThisSiteTitle}" when left blank.`}
				/>

				<div class="settings-preview" aria-live="polite">
					<p class="settings-preview__label">This Site card preview</p>
					<ThisSiteBlock class="min-h-[11rem]" />
				</div>
			</div>
		</div>

		<div class="settings-card">
			<div class="settings-card__header">
				<div>
					<p class="settings-card__title">Blog</p>
					<p class="settings-card__subtitle">Essay browsing defaults</p>
				</div>
			</div>

			<Select
				label="Tag Browser View"
				value={blogSettings.tagView}
				onchange={handleBlogTagViewChange}
				options={blogViewOptions}
				hint="Used as the default when the blog URL does not specify a view."
			/>
		</div>

		<div class="settings-card">
			<div class="settings-card__header">
				<div>
					<p class="settings-card__title">Layout</p>
					<p class="settings-card__subtitle">Manage saved homepage customization</p>
				</div>
			</div>

			<div class="settings-card__stack">
				<p class="settings-note">
					Resetting layout restores the shared homepage grid order and span defaults.
				</p>
				<button type="button" class="settings-action" onclick={resetHomepageLayout}>
					{resetStatus === 'done' ? 'Reset complete' : 'Reset homepage layout'}
				</button>
			</div>
		</div>
	</div>
</section>

<style>
	.settings-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.settings-hero {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 1rem;
		border: 0.0625rem solid var(--border-color);
		background:
			radial-gradient(circle at top right, rgba(90, 150, 255, 0.12), transparent 32%),
			var(--surface);
	}

	.settings-hero__title {
		margin: 0 0 0.35rem;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.settings-hero__body {
		margin: 0;
		max-width: 42rem;
		color: var(--text-muted);
		line-height: 1.6;
	}

	.settings-hero__pill {
		flex-shrink: 0;
		padding: 0.35rem 0.65rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--caroline-blue-600) 18%, var(--surface));
		color: var(--caroline-blue-700);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.settings-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.settings-card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 1rem;
		border: 0.0625rem solid var(--border-color);
		background: var(--surface);
	}

	.settings-card__header {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.settings-card__title {
		margin: 0 0 0.25rem;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.settings-card__subtitle {
		margin: 0;
		font-size: 0.82rem;
		color: var(--text-muted);
	}

	.settings-card__stack {
		display: grid;
		gap: 1rem;
	}

	.settings-note {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--text-secondary);
	}

	.settings-preview {
		display: grid;
		gap: 0.75rem;
	}

	.settings-preview__label {
		margin: 0;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.settings-action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: fit-content;
		padding: 0.7rem 1rem;
		border: none;
		border-radius: 0.65rem;
		background: var(--text-primary);
		color: var(--page-bg);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			transform 0.15s ease,
			opacity 0.15s ease;
	}

	.settings-action:hover {
		opacity: 0.92;
		transform: translateY(-0.0625rem);
	}

	@media (max-width: 48rem) {
		.settings-grid {
			grid-template-columns: 1fr;
		}

		.settings-hero {
			flex-direction: column;
		}
	}
</style>
