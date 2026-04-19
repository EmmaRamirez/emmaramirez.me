<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'clsx';
	import { resolve } from '$app/paths';
	import { cn } from '$lib/utils';
	import { Tooltip } from '$lib/components/ui';
	import { onDestroy } from 'svelte';
	import HeaderLogoMark from './HeaderLogoMark.svelte';

	interface HeaderLogoProps {
		class?: ClassValue;
		children?: Snippet;
	}

	let { class: className, children }: HeaderLogoProps = $props();

	const HOVER_EXIT_DELAY_MS = 160;

	let isHovered = $state(false);
	let hoverExitTimeout: ReturnType<typeof setTimeout> | undefined;

	function clearHoverExitTimeout() {
		if (hoverExitTimeout !== undefined) {
			clearTimeout(hoverExitTimeout);
			hoverExitTimeout = undefined;
		}
	}

	function handleMouseEnter() {
		clearHoverExitTimeout();
		isHovered = true;
	}

	function handleMouseLeave() {
		clearHoverExitTimeout();
		hoverExitTimeout = setTimeout(() => {
			isHovered = false;
			hoverExitTimeout = undefined;
		}, HOVER_EXIT_DELAY_MS);
	}

	onDestroy(() => {
		clearHoverExitTimeout();
	});
</script>

<Tooltip text="emzinnia.dev" position="bottom" align="start" embeddable class="shrink-0">
	<a
		href={resolve('/')}
		class={cn(
			'header-logo style-none flex items-center gap-3',
			{ 'is-hovered': isHovered },
			children && 'text-lg font-semibold text-(--text-primary)',
			'transition-colors duration-200',
			className
		)}
		aria-label="EMZINNIA home"
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
	>
		<HeaderLogoMark />
		{#if children}
			<span class="header-logo__wordmark tracking-tight">
				{@render children()}
			</span>
		{/if}
	</a>
</Tooltip>

<style>
	.header-logo.is-hovered .header-logo__wordmark {
		color: var(--link-hover);
	}
</style>
