<script lang="ts">
	import type { Snippet } from 'svelte';

	type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';

	interface PopoverProps {
		/** Custom class names */
		class?: string;
		/** Whether popover is open */
		open?: boolean;
		/** Position relative to trigger */
		position?: PopoverPosition;
		/** Callback when popover should close */
		onclose?: () => void;
		/** Trigger element */
		trigger?: Snippet;
		/** Popover content */
		children?: Snippet;
	}

	let {
		class: className = '',
		open = $bindable(false),
		position = 'bottom',
		onclose,
		trigger,
		children
	}: PopoverProps = $props();

	function toggle() {
		open = !open;
		if (!open) {
			onclose?.();
		}
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.popover-container')) {
			open = false;
			onclose?.();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			open = false;
			onclose?.();
		}
	}

	const positionClasses: Record<PopoverPosition, string> = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2'
	};
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class="popover-container relative inline-flex {className}">
	<div
		role="button"
		tabindex="0"
		onclick={toggle}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				toggle();
			}
		}}
		aria-expanded={open}
		aria-haspopup="true"
	>
		{@render trigger?.()}
	</div>

	{#if open}
		<div
			class="absolute z-50 min-w-48 rounded-lg border-2 border-[var(--liver-brown-500)] bg-[var(--sandy-tan-200)] shadow-xl {positionClasses[
				position
			]}"
			role="dialog"
		>
			<div class="p-3">
				{@render children?.()}
			</div>
		</div>
	{/if}
</div>
