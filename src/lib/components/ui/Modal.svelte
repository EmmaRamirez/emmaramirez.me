<script lang="ts">
	import type { Snippet } from 'svelte';

	type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

	interface ModalProps {
		/** Whether the modal is open */
		open?: boolean;
		/** Callback when modal should close */
		onclose?: () => void;
		/** Modal size */
		size?: ModalSize;
		/** Modal title */
		title?: string;
		/** Custom class names */
		class?: string;
		/** Header content */
		header?: Snippet;
		/** Footer content (usually actions) */
		footer?: Snippet;
		/** Main content */
		children?: Snippet;
	}

	let {
		open = false,
		onclose,
		size = 'md',
		title,
		class: className = '',
		header,
		footer,
		children
	}: ModalProps = $props();

	const sizeClasses: Record<ModalSize, string> = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]'
	};

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onclose?.();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onclose?.();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		onclick={handleBackdropClick}
		role="presentation"
	>
		<div
			class="w-full {sizeClasses[
				size
			]} animate-modal-in flex max-h-[90vh] flex-col rounded-xl border-2 border-[var(--liver-brown-500)] bg-[var(--sandy-tan-200)] shadow-2xl {className}"
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
		>
			{#if header || title}
				<div
					class="flex items-center justify-between rounded-t-xl border-b-2 border-[var(--liver-brown-500)] bg-[var(--sandy-tan-300)] px-6 py-4"
				>
					{#if header}
						{@render header()}
					{:else if title}
						<h2 id="modal-title" class="text-lg font-semibold text-[var(--liver-brown-900)]">
							{title}
						</h2>
					{/if}
					<button
						type="button"
						class="-mr-2 cursor-pointer rounded-full p-2 text-[var(--liver-brown-700)] transition-colors hover:bg-[var(--liver-brown-500)]/20"
						onclick={() => onclose?.()}
						aria-label="Close modal"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
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
				</div>
			{/if}

			<div class="flex-1 overflow-y-auto px-6 py-4">
				{@render children?.()}
			</div>

			{#if footer}
				<div
					class="flex items-center justify-end gap-3 rounded-b-xl border-t-2 border-[var(--liver-brown-500)] bg-[var(--sandy-tan-300)] px-6 py-4"
				>
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	@keyframes modal-in {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(-0.625rem);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.animate-modal-in {
		animation: modal-in 0.2s ease-out;
	}
</style>
