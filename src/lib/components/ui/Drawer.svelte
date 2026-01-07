<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils";

	interface DrawerProps {
		open?: boolean;
		onclose?: () => void;
		position?: 'left' | 'right';
		width?: string;
		class?: string;
		header?: Snippet;
		children?: Snippet;
	}

	let { 
		open = false, 
		onclose, 
		position = 'right',
		width = '25rem',
		class: className,
		header,
		children 
	}: DrawerProps = $props();

	function handleBackdropClick() {
		onclose?.();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onclose?.();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div 
		class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
		onclick={handleBackdropClick}
		role="presentation"
	></div>

	<div
		class={cn(
			"fixed top-0 bottom-0 z-50 bg-[var(--sandy-tan-100)] border-[var(--liver-brown-500)] shadow-2xl flex flex-col overflow-hidden",
			position === 'right' ? 'right-0 border-l-2 animate-slide-in-right' : 'left-0 border-r-2 animate-slide-in-left',
			className
		)}
		style="width: min({width}, 100vw);"
		role="dialog"
		aria-modal="true"
	>
		{#if header}
			<div class="flex items-center justify-between px-5 py-4 border-b-2 border-[var(--liver-brown-500)] bg-[var(--sandy-tan-300)]">
				<div class="flex-1">
					{@render header()}
				</div>
				<button 
					class="p-2 rounded-full hover:bg-[var(--liver-brown-200)] transition-colors text-[var(--liver-brown-700)]"
					onclick={() => onclose?.()}
					aria-label="Close drawer"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>
		{/if}

		<div class="flex-1 overflow-y-auto p-5">
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	@keyframes slide-in-right {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}

	@keyframes slide-in-left {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(0);
		}
	}

	.animate-slide-in-right {
		animation: slide-in-right 0.25s ease-out;
	}

	.animate-slide-in-left {
		animation: slide-in-left 0.25s ease-out;
	}
</style>

