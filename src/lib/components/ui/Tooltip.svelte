<script lang="ts">
	import type { Snippet } from 'svelte';

	type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

	interface TooltipProps {
		/** Custom class names */
		class?: string;
		/** Tooltip content text */
		text: string;
		/** Position of tooltip relative to trigger */
		position?: TooltipPosition;
		/** Delay before showing (ms) */
		delay?: number;
		/** Trigger element */
		children?: Snippet;
	}

	let {
		class: className = '',
		text,
		position = 'top',
		delay = 200,
		children
	}: TooltipProps = $props();

	let visible = $state(false);
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	function show() {
		timeoutId = setTimeout(() => {
			visible = true;
		}, delay);
	}

	function hide() {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
		visible = false;
	}

	const positionClasses: Record<TooltipPosition, string> = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2'
	};

	const arrowClasses: Record<TooltipPosition, string> = {
		top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--liver-brown-800)] border-x-transparent border-b-transparent',
		bottom:
			'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--liver-brown-800)] border-x-transparent border-t-transparent',
		left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--liver-brown-800)] border-y-transparent border-r-transparent',
		right:
			'right-full top-1/2 -translate-y-1/2 border-r-[var(--liver-brown-800)] border-y-transparent border-l-transparent'
	};
</script>

<div class="relative inline-flex {className}">
	<div
		role="button"
		tabindex="0"
		onmouseenter={show}
		onmouseleave={hide}
		onfocus={show}
		onblur={hide}
	>
		{@render children?.()}
	</div>

	{#if visible}
		<div
			role="tooltip"
			class="pointer-events-none absolute z-50 rounded bg-[var(--liver-brown-800)] px-2 py-1 text-xs font-medium whitespace-nowrap text-white shadow-lg {positionClasses[
				position
			]}"
		>
			{text}
			<span class="absolute h-0 w-0 border-4 {arrowClasses[position]}"></span>
		</div>
	{/if}
</div>
