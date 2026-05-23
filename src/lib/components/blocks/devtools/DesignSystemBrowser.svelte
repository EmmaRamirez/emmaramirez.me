<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		open?: boolean;
		inline?: boolean;
		onclose?: () => void;
	}

	let { open = false, inline = false, onclose }: Props = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (!open) {
			return;
		}

		if (event.key === 'Escape') {
			onclose?.();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	{#if !inline}
		<div
			class="design-browser-backdrop"
			transition:fade={{ duration: 300, easing: cubicOut }}
			onclick={onclose}
			role="presentation"
		></div>
	{/if}

	<div
		class="design-browser"
		class:design-browser--inline={inline}
		transition:fly={{ y: 40, duration: 400, easing: cubicOut }}
		role={inline ? 'region' : 'dialog'}
		aria-modal={inline ? undefined : 'true'}
		aria-labelledby="design-browser-title"
	>
		<header class="design-browser__header">
			<div class="flex items-center gap-3">
				<div class="design-browser__logo" aria-hidden="true">
					<svg
						width="32"
						height="32"
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect width="32" height="32" rx="6" fill="var(--caroline-blue-700)" />
						<path
							d="M8 10h16M8 16h16M8 22h10"
							stroke="white"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
				</div>
				<div>
					<h1 id="design-browser-title" class="text-xl font-bold text-(--text-primary)">
						EMZINNIA Design System
					</h1>
					<p class="text-sm text-(--text-muted)">Components, tokens, and patterns</p>
				</div>
			</div>
			<button
				class="design-browser__close"
				onclick={onclose}
				aria-label="Close design system browser"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		</header>

		<div class="design-browser__body" aria-label="Design system workspace"></div>
	</div>
{/if}

<style>
	.design-browser-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(0.5rem);
		z-index: 100;
	}

	.design-browser {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(90vw, 62.5rem);
		max-height: 85vh;
		background: var(--page-bg-subtle);
		border: 0.125rem solid var(--border-color);
		border-radius: 1rem;
		box-shadow:
			0 1.5625rem 3.125rem -0.75rem rgba(0, 0, 0, 0.4),
			0 0 0 0.0625rem var(--border-color);
		z-index: 101;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.design-browser--inline {
		position: relative;
		top: auto;
		left: auto;
		transform: none;
		width: 100%;
		max-height: none;
	}

	.design-browser__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.5rem;
		border-bottom: 0.125rem solid var(--border-color);
		background: var(--header-bg);
	}

	.design-browser__logo {
		flex-shrink: 0;
	}

	.design-browser__close {
		padding: 0.5rem;
		border-radius: 0.5rem;
		color: var(--text-muted);
		transition: all 0.2s ease;
		cursor: pointer;
		background: transparent;
		border: none;
	}

	.design-browser__close:hover {
		background: var(--surface-hover);
		color: var(--text-primary);
	}

	.design-browser__body {
		flex: 1;
		overflow: hidden;
		min-height: min(40rem, calc(85vh - 5.25rem));
	}

	@media (max-width: 40rem) {
		.design-browser {
			width: 95vw;
			max-height: 90vh;
		}

		.design-browser__body {
			min-height: min(32rem, calc(90vh - 5.25rem));
		}
	}
</style>
