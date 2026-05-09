<script lang="ts">
	import { onMount } from 'svelte';
	import { theme, type ThemeMode } from '$lib/stores/userSettings.svelte';

	let currentTheme = $state<ThemeMode>('light');
	let splitRatio = $state(0.38);
	let isDraggingDivider = $state(false);
	let dragBounds = $state<{ left: number; width: number } | null>(null);

	function clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}

	function setSplitRatioFromClientX(clientX: number) {
		if (!dragBounds) return;

		const nextRatio = (clientX - dragBounds.left) / dragBounds.width;
		splitRatio = clamp(nextRatio, 0.24, 0.76);
	}

	function handleDividerPointerdown(event: PointerEvent) {
		const splitPanel = (event.currentTarget as HTMLButtonElement | null)?.parentElement;
		if (!splitPanel) return;

		const rect = splitPanel.getBoundingClientRect();
		dragBounds = { left: rect.left, width: rect.width };
		isDraggingDivider = true;
		setSplitRatioFromClientX(event.clientX);
	}

	function handleWindowPointermove(event: PointerEvent) {
		if (!isDraggingDivider) return;
		setSplitRatioFromClientX(event.clientX);
	}

	function stopDividerDrag() {
		isDraggingDivider = false;
		dragBounds = null;
	}

	onMount(() => {
		currentTheme = $theme;

		const unsubscribeTheme = theme.subscribe((value) => {
			currentTheme = value;
		});

		return () => {
			unsubscribeTheme();
		};
	});
</script>

<svelte:window onpointermove={handleWindowPointermove} onpointerup={stopDividerDrag} />

<section class="theme-section">
	<header class="theme-hero">
		<div>
			<h2 class="theme-hero__title">Theme</h2>
			<p class="theme-hero__body">
				Manage the global color mode separately from the rest of the site defaults. Changes here
				apply anywhere the site theme toggle does.
			</p>
		</div>
		<span class="theme-hero__pill">Global</span>
	</header>

	<div
		class={['theme-card', 'theme-card--split', currentTheme === 'dark' && 'theme-card--dark']}
		style:--theme-pane-width={`${splitRatio * 100}%`}
	>
		<div class="theme-pane theme-pane--controls">
			<div class="theme-card__header">
				<div>
					<p class="theme-card__title">Color Mode</p>
					<p class="theme-card__subtitle">Persistent appearance preference for the whole site</p>
				</div>
			</div>

			<div class="theme-card__stack">
				<div>
					<p class="theme-field__label">Theme</p>
					<p class="theme-field__hint">
						Switches the same stored preference used by the header toggle.
					</p>
				</div>

				<div class="segmented-control" role="group" aria-label="Theme mode">
					<button
						type="button"
						class="segmented-control__button"
						class:segmented-control__button--active={currentTheme === 'light'}
						aria-pressed={currentTheme === 'light'}
						onclick={() => theme.set('light')}
					>
						Light
					</button>
					<button
						type="button"
						class="segmented-control__button"
						class:segmented-control__button--active={currentTheme === 'dark'}
						aria-pressed={currentTheme === 'dark'}
						onclick={() => theme.set('dark')}
					>
						Dark
					</button>
				</div>
			</div>
		</div>

		<button
			type="button"
			class="theme-divider"
			class:theme-divider--dragging={isDraggingDivider}
			aria-label="Resize theme panel layout"
			onpointerdown={handleDividerPointerdown}
		>
			<span class="theme-divider__line" aria-hidden="true"></span>
			<span class="theme-divider__handle" aria-hidden="true"></span>
		</button>

		<div class="theme-pane theme-pane--preview">
			<div class="theme-card__header">
				<div>
					<p class="theme-card__title">Preview</p>
					<p class="theme-card__subtitle">Quick confirmation of the currently selected mode</p>
				</div>
				<span class="theme-status">{currentTheme === 'dark' ? 'Dark active' : 'Light active'}</span>
			</div>

			<div class="theme-preview" aria-hidden="true">
				<div class="theme-preview__chrome">
					<span></span>
					<span></span>
					<span></span>
				</div>
				<div class="theme-preview__surface">
					<div class="theme-preview__hero"></div>
					<div class="theme-preview__lines">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.theme-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.theme-hero {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 1rem;
		border: 0.0625rem solid var(--border-color);
		background:
			radial-gradient(circle at top right, rgba(90, 150, 255, 0.14), transparent 32%),
			var(--surface);
	}

	.theme-hero__title {
		margin: 0 0 0.35rem;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.theme-hero__body {
		margin: 0;
		max-width: 42rem;
		color: var(--text-muted);
		line-height: 1.6;
	}

	.theme-hero__pill {
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

	.theme-card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 1rem;
		border: 0.0625rem solid var(--border-color);
		background: var(--surface);
	}

	.theme-card--split {
		display: grid;
		grid-template-columns: minmax(16rem, var(--theme-pane-width)) 1.5rem minmax(18rem, 1fr);
		gap: 0;
		padding: 0;
		overflow: hidden;
		background:
			radial-gradient(circle at top left, rgba(255, 214, 102, 0.12), transparent 28%),
			var(--surface);
	}

	.theme-card--dark {
		background:
			radial-gradient(circle at top left, rgba(90, 150, 255, 0.2), transparent 32%), var(--surface);
	}

	.theme-pane {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.25rem;
		min-width: 0;
	}

	.theme-pane--controls {
		padding-right: 1rem;
	}

	.theme-pane--preview {
		padding-left: 1rem;
	}

	.theme-card__header {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		align-items: flex-start;
	}

	.theme-card__title {
		margin: 0 0 0.25rem;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.theme-card__subtitle {
		margin: 0;
		font-size: 0.82rem;
		color: var(--text-muted);
	}

	.theme-card__stack {
		display: grid;
		gap: 1rem;
	}

	.theme-field__label {
		margin: 0 0 0.25rem;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.theme-field__hint {
		margin: 0;
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	.theme-divider {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		padding: 0;
		border: none;
		background: transparent;
		cursor: col-resize;
		touch-action: none;
	}

	.theme-divider__line {
		position: absolute;
		top: 1rem;
		bottom: 1rem;
		width: 0.0625rem;
		background: color-mix(in srgb, var(--border-color) 78%, transparent);
	}

	.theme-divider__handle {
		position: relative;
		width: 0.75rem;
		height: 3rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--surface-hover) 78%, var(--surface));
		border: 0.0625rem solid color-mix(in srgb, var(--border-color) 72%, transparent);
		box-shadow: 0 0.125rem 0.35rem rgba(0, 0, 0, 0.08);
	}

	.theme-divider__handle::before {
		content: '';
		position: absolute;
		inset: 0.65rem 0.25rem;
		border-radius: 999px;
		background: repeating-linear-gradient(
			to bottom,
			color-mix(in srgb, var(--text-muted) 55%, transparent) 0,
			color-mix(in srgb, var(--text-muted) 55%, transparent) 0.12rem,
			transparent 0.12rem,
			transparent 0.32rem
		);
	}

	.theme-divider:hover .theme-divider__handle,
	.theme-divider--dragging .theme-divider__handle {
		background: color-mix(in srgb, var(--caroline-blue-700) 18%, var(--surface));
		border-color: color-mix(in srgb, var(--caroline-blue-700) 36%, var(--border-color));
	}

	.segmented-control {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		width: 100%;
		max-width: 14rem;
		padding: 0.25rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--page-bg-subtle) 70%, var(--surface));
		border: 0.0625rem solid var(--border-color);
	}

	.segmented-control__button {
		padding: 0.5rem 0.9rem;
		border: none;
		border-radius: 999px;
		background: transparent;
		color: var(--text-secondary);
		font-size: 0.85rem;
		font-weight: 600;
		text-align: center;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.segmented-control__button:hover {
		color: var(--text-primary);
		background: color-mix(in srgb, var(--surface-hover) 60%, transparent);
	}

	.segmented-control__button--active {
		background: var(--caroline-blue-700);
		color: #fff;
		box-shadow: 0 0.125rem 0.35rem rgba(0, 0, 0, 0.18);
	}

	.theme-status {
		padding: 0.3rem 0.6rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--surface-hover) 70%, var(--surface));
		color: var(--text-secondary);
		font-size: 0.72rem;
		font-weight: 600;
	}

	.theme-preview {
		display: grid;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 0.9rem;
		border: 0.0625rem solid color-mix(in srgb, var(--border-color) 70%, transparent);
		background: color-mix(in srgb, var(--background) 82%, var(--surface));
	}

	.theme-preview__chrome {
		display: flex;
		gap: 0.35rem;
	}

	.theme-preview__chrome span {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--text-muted) 45%, transparent);
	}

	.theme-preview__surface {
		display: grid;
		gap: 0.85rem;
		padding: 1rem;
		border-radius: 0.75rem;
		background: color-mix(in srgb, var(--surface) 78%, var(--background));
		border: 0.0625rem solid color-mix(in srgb, var(--border-color) 65%, transparent);
	}

	.theme-preview__hero {
		height: 6rem;
		border-radius: 0.75rem;
		background:
			linear-gradient(135deg, rgba(90, 150, 255, 0.85), rgba(138, 92, 246, 0.65)),
			var(--surface-hover);
	}

	.theme-preview__lines {
		display: grid;
		gap: 0.55rem;
	}

	.theme-preview__lines span {
		display: block;
		height: 0.75rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--text-secondary) 18%, transparent);
	}

	.theme-preview__lines span:nth-child(2) {
		width: 85%;
	}

	.theme-preview__lines span:nth-child(3) {
		width: 65%;
	}

	@media (max-width: 48rem) {
		.theme-hero {
			flex-direction: column;
		}

		.theme-card--split {
			grid-template-columns: 1fr;
		}

		.theme-pane--controls,
		.theme-pane--preview {
			padding: 1.25rem;
		}

		.theme-divider {
			display: none;
		}
	}
</style>
