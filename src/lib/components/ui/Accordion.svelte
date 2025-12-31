<script lang="ts">
	import type { Snippet } from "svelte";

	type AccordionItem = {
		id: string;
		title: string;
		content: string;
		disabled?: boolean;
	};

	interface AccordionProps {
		/** Custom class names */
		class?: string;
		/** Accordion items */
		items: AccordionItem[];
		/** Allow multiple panels open */
		multiple?: boolean;
		/** Initially open panel ids */
		defaultOpen?: string[];
	}

	let {
		class: className = '',
		items,
		multiple = false,
		defaultOpen = []
	}: AccordionProps = $props();

	let openPanels = $state<Set<string>>(new Set());

	$effect(() => {
		openPanels = new Set(defaultOpen);
	});

	function togglePanel(id: string) {
		if (openPanels.has(id)) {
			openPanels.delete(id);
			openPanels = new Set(openPanels);
		} else {
			if (multiple) {
				openPanels.add(id);
				openPanels = new Set(openPanels);
			} else {
				openPanels = new Set([id]);
			}
		}
	}

	function isOpen(id: string): boolean {
		return openPanels.has(id);
	}
</script>

<div class="divide-y divide-[var(--liver-brown-500)] border-y border-[var(--liver-brown-500)] {className}">
	{#each items as item (item.id)}
		<div>
			<h3>
				<button
					type="button"
					id="accordion-header-{item.id}"
					aria-expanded={isOpen(item.id)}
					aria-controls="accordion-panel-{item.id}"
					disabled={item.disabled}
					class="flex w-full items-center justify-between gap-4 py-4 px-1 text-left text-[var(--liver-brown-800)] font-medium transition-colors hover:text-[var(--liver-brown-900)] focus:outline-none focus:ring-2 focus:ring-[var(--caroline-blue-500)] focus:ring-inset rounded {item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
					onclick={() => !item.disabled && togglePanel(item.id)}
				>
					<span>{item.title}</span>
					<svg 
						class="shrink-0 transition-transform duration-200 {isOpen(item.id) ? 'rotate-180' : ''}"
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
						<path d="m6 9 6 6 6-6"/>
					</svg>
				</button>
			</h3>

			{#if isOpen(item.id)}
				<div
					id="accordion-panel-{item.id}"
					role="region"
					aria-labelledby="accordion-header-{item.id}"
					class="pb-4 px-1 text-[var(--liver-brown-700)] animate-accordion-open"
				>
					{item.content}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	@keyframes accordion-open {
		from {
			opacity: 0;
			max-height: 0;
		}
		to {
			opacity: 1;
			max-height: 500px;
		}
	}

	.animate-accordion-open {
		animation: accordion-open 0.2s ease-out;
	}
</style>
