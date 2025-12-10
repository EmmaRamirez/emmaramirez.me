<script lang="ts">
	import type { Snippet } from "svelte";

	type TabItem = {
		id: string;
		label: string;
		disabled?: boolean;
	};

	interface TabsProps {
		/** Custom class names */
		class?: string;
		/** Array of tab items */
		tabs: TabItem[];
		/** Currently active tab id */
		activeTab?: string;
		/** Callback when tab changes */
		onchange?: (tabId: string) => void;
		/** Tab content - receives activeTab as argument */
		children?: Snippet<[string]>;
	}

	let {
		class: className = '',
		tabs,
		activeTab = $bindable(tabs[0]?.id ?? ''),
		onchange,
		children
	}: TabsProps = $props();

	function selectTab(tabId: string) {
		activeTab = tabId;
		onchange?.(tabId);
	}

	function handleKeydown(e: KeyboardEvent, currentIndex: number) {
		let newIndex = currentIndex;
		
		if (e.key === 'ArrowRight') {
			newIndex = (currentIndex + 1) % tabs.length;
		} else if (e.key === 'ArrowLeft') {
			newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
		} else if (e.key === 'Home') {
			newIndex = 0;
		} else if (e.key === 'End') {
			newIndex = tabs.length - 1;
		} else {
			return;
		}

		e.preventDefault();
		const newTab = tabs[newIndex];
		if (newTab && !newTab.disabled) {
			selectTab(newTab.id);
		}
	}
</script>

<div class={className}>
	<!-- Tab List -->
	<div 
		class="flex border-b-2 border-[var(--liver-brown-500)]"
		role="tablist"
	>
		{#each tabs as tab, i (tab.id)}
			<button
				type="button"
				role="tab"
				id="tab-{tab.id}"
				aria-selected={activeTab === tab.id}
				aria-controls="tabpanel-{tab.id}"
				tabindex={activeTab === tab.id ? 0 : -1}
				disabled={tab.disabled}
				class="px-4 py-2.5 text-sm font-medium transition-colors relative -mb-[2px]
					{activeTab === tab.id 
						? 'text-[var(--caroline-blue-700)] border-b-2 border-[var(--caroline-blue-700)] bg-[var(--sandy-tan-200)]' 
						: 'text-[var(--liver-brown-600)] hover:text-[var(--liver-brown-800)] hover:bg-[var(--sandy-tan-400)] border-b-2 border-transparent'}
					{tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
					focus:outline-none focus:ring-2 focus:ring-[var(--caroline-blue-500)] focus:ring-inset rounded-t-lg"
				onclick={() => !tab.disabled && selectTab(tab.id)}
				onkeydown={(e) => handleKeydown(e, i)}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<!-- Tab Panels -->
	{#each tabs as tab (tab.id)}
		<div
			role="tabpanel"
			id="tabpanel-{tab.id}"
			aria-labelledby="tab-{tab.id}"
			hidden={activeTab !== tab.id}
			class="py-4"
		>
			{#if activeTab === tab.id && children}
				{@render children(activeTab)}
			{/if}
		</div>
	{/each}
</div>

