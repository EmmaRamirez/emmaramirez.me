<script lang="ts">
	import type { Snippet } from "svelte";

	type MenuItem = {
		id: string;
		label: string;
		icon?: string;
		href?: string;
		disabled?: boolean;
		danger?: boolean;
		divider?: boolean;
	};

	interface DropdownMenuProps {
		/** Custom class names */
		class?: string;
		/** Whether menu is open */
		open?: boolean;
		/** Menu items */
		items: MenuItem[];
		/** Callback when item is selected */
		onselect?: (itemId: string) => void;
		/** Callback when menu closes */
		onclose?: () => void;
		/** Trigger element */
		trigger?: Snippet;
	}

	let {
		class: className = '',
		open = $bindable(false),
		items,
		onselect,
		onclose,
		trigger
	}: DropdownMenuProps = $props();

	function toggle() {
		open = !open;
		if (!open) {
			onclose?.();
		}
	}

	function selectItem(item: MenuItem) {
		if (item.disabled || item.divider) return;
		onselect?.(item.id);
		open = false;
		onclose?.();
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.dropdown-container')) {
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
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class="relative inline-flex dropdown-container {className}">
	<div 
		role="button"
		tabindex="0"
		onclick={toggle}
		onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
		aria-expanded={open}
		aria-haspopup="menu"
	>
		{@render trigger?.()}
	</div>

	{#if open}
		<div
			class="absolute top-full right-0 mt-1 z-50 min-w-48 bg-[var(--sandy-tan-200)] border-2 border-[var(--liver-brown-500)] rounded-lg shadow-xl overflow-hidden"
			role="menu"
		>
			{#each items as item (item.id)}
				{#if item.divider}
					<hr class="border-t border-[var(--liver-brown-500)] my-1" />
				{:else if item.href}
					<a
						href={item.href}
						role="menuitem"
						class="flex items-center gap-2 px-3 py-2 text-sm transition-colors style-none no-underline
							{item.danger ? 'text-red-600 hover:bg-red-50' : 'text-[var(--liver-brown-800)] hover:bg-[var(--sandy-tan-400)]'}
							{item.disabled ? 'opacity-50 pointer-events-none' : ''}"
					>
						{item.label}
					</a>
				{:else}
					<button
						type="button"
						role="menuitem"
						disabled={item.disabled}
						class="flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors
							{item.danger ? 'text-red-600 hover:bg-red-50' : 'text-[var(--liver-brown-800)] hover:bg-[var(--sandy-tan-400)]'}
							{item.disabled ? 'opacity-50 cursor-not-allowed' : ''}"
						onclick={() => selectItem(item)}
					>
						{item.label}
					</button>
				{/if}
			{/each}
		</div>
	{/if}
</div>

