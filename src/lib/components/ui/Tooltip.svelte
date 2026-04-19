<script lang="ts">
	import type { Snippet } from 'svelte';

	type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
	type TooltipAlign = 'center' | 'start' | 'end';

	interface TooltipProps {
		/** Custom class names */
		class?: string;
		/** Tooltip content text */
		text: string;
		/** Position of tooltip relative to trigger */
		position?: TooltipPosition;
		/** Horizontal (top/bottom) or vertical (left/right) alignment along the trigger edge */
		align?: TooltipAlign;
		/** Delay before showing (ms) */
		delay?: number;
		/**
		 * When true, do not wrap children in a focusable `role="button"` shell.
		 * Use when the child is already interactive (e.g. a link or button).
		 */
		embeddable?: boolean;
		/** Trigger element */
		children?: Snippet;
	}

	let {
		class: className = '',
		text,
		position = 'top',
		align = 'center',
		delay = 200,
		embeddable = false,
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

	function handleFocusOut(event: FocusEvent) {
		const related = event.relatedTarget as Node | null;
		if (related && (event.currentTarget as HTMLElement).contains(related)) return;
		hide();
	}

	function edgeAlignMain(axis: 'tb' | 'lr'): string {
		if (axis === 'tb') {
			if (align === 'start') return 'left-0';
			if (align === 'end') return 'right-0';
			return 'left-1/2 -translate-x-1/2';
		}
		if (align === 'start') return 'top-0';
		if (align === 'end') return 'bottom-0';
		return 'top-1/2 -translate-y-1/2';
	}

	function positionClassesFor(): string {
		switch (position) {
			case 'top':
				return `bottom-full mb-2 ${edgeAlignMain('tb')}`;
			case 'bottom':
				return `top-full mt-2 ${edgeAlignMain('tb')}`;
			case 'left':
				return `right-full mr-2 ${edgeAlignMain('lr')}`;
			case 'right':
				return `left-full ml-2 ${edgeAlignMain('lr')}`;
			default:
				return '';
		}
	}

	/** Border colors for the CSS triangle; inline so Tailwind JIT emits no wrong fallback (dynamic arbitrary classes are not scanned). */
	function arrowBorderStyle(): string {
		const bg = 'var(--tooltip-bg)';
		const x = 'transparent';
		switch (position) {
			case 'top':
				return `border-top-color: ${bg}; border-left-color: ${x}; border-right-color: ${x}; border-bottom-color: ${x};`;
			case 'bottom':
				return `border-bottom-color: ${bg}; border-left-color: ${x}; border-right-color: ${x}; border-top-color: ${x};`;
			case 'left':
				return `border-left-color: ${bg}; border-top-color: ${x}; border-bottom-color: ${x}; border-right-color: ${x};`;
			case 'right':
				return `border-right-color: ${bg}; border-top-color: ${x}; border-bottom-color: ${x}; border-left-color: ${x};`;
			default:
				return '';
		}
	}

	function arrowClassesFor(): string {
		const base = 'absolute box-border h-0 w-0 border-4 border-solid';
		switch (position) {
			case 'top':
				if (align === 'start')
					return `${base} top-full left-[1.125rem] -translate-x-1/2`;
				if (align === 'end')
					return `${base} top-full right-[1.125rem] translate-x-1/2`;
				return `${base} top-full left-1/2 -translate-x-1/2`;
			case 'bottom':
				if (align === 'start')
					return `${base} bottom-full left-[1.125rem] -translate-x-1/2`;
				if (align === 'end')
					return `${base} bottom-full right-[1.125rem] translate-x-1/2`;
				return `${base} bottom-full left-1/2 -translate-x-1/2`;
			case 'left':
				if (align === 'start')
					return `${base} left-full top-[1.125rem] -translate-y-1/2`;
				if (align === 'end')
					return `${base} left-full bottom-[1.125rem] translate-y-1/2`;
				return `${base} left-full top-1/2 -translate-y-1/2`;
			case 'right':
				if (align === 'start')
					return `${base} right-full top-[1.125rem] -translate-y-1/2`;
				if (align === 'end')
					return `${base} right-full bottom-[1.125rem] translate-y-1/2`;
				return `${base} right-full top-1/2 -translate-y-1/2`;
			default:
				return base;
		}
	}
</script>

<div
	class="relative inline-flex {className}"
	onmouseenter={embeddable ? show : undefined}
	onmouseleave={embeddable ? hide : undefined}
	onfocusin={embeddable ? show : undefined}
	onfocusout={embeddable ? handleFocusOut : undefined}
>
	{#if embeddable}
		{@render children?.()}
	{:else}
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
	{/if}

	{#if visible}
		<div
			role="tooltip"
			class="pointer-events-none absolute z-[100] rounded border border-(--border-color) bg-(--tooltip-bg) px-2 py-1 text-xs font-medium whitespace-nowrap text-(--tooltip-fg) shadow-lg {positionClassesFor()}"
		>
			{text}
			<span class={arrowClassesFor()} style={arrowBorderStyle()}></span>
		</div>
	{/if}
</div>
