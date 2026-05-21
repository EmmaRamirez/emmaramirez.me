<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import type { Attachment } from 'svelte/attachments';
	import { cn } from '$lib/utils';

	interface HeaderProps {
		class?: ClassValue;
		sticky?: boolean;
		children?: Snippet;
	}

	let { class: className, sticky = false, children }: HeaderProps = $props();

	const trackSiteHeaderHeight: Attachment<HTMLElement> = (header) => {
		const update = () => {
			document.documentElement.style.setProperty(
				'--site-header-height',
				`${header.getBoundingClientRect().height}px`
			);
		};

		update();
		const observer = new ResizeObserver(update);
		observer.observe(header);

		return () => {
			observer.disconnect();
		};
	};
</script>

<header
	{@attach trackSiteHeaderHeight}
	class={cn(
		'flex min-w-0 w-full max-w-full items-center gap-4 overflow-visible bg-(--header-bg) backdrop-blur-sm',
		'px-4 py-3 md:px-6 md:py-4',
		'transition-all duration-300',
		sticky && 'sticky top-0 z-50',
		className
	)}
>
	{@render children?.()}
</header>
