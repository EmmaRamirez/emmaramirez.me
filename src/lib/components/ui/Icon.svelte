<script lang="ts">
	import type { Snippet } from "svelte";

	type IconSize = 'sm' | 'md' | 'lg' | 'xl';

	interface IconProps {
		/** Custom class names */
		class?: string;
		/** Size of the icon */
		size?: IconSize;
		/** Accessible label for the icon. If provided, icon is semantic; otherwise decorative */
		'aria-label'?: string;
		/** SVG icon content passed as a snippet */
		children?: Snippet;
	}

	let {
		class: className = '',
		size = 'md',
		'aria-label': ariaLabel,
		children
	}: IconProps = $props();

	const sizeClasses: Record<IconSize, string> = {
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
		lg: 'w-6 h-6',
		xl: 'w-8 h-8'
	};

	const isDecorative = $derived(!ariaLabel);

	const combinedClasses = $derived(
		`inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`.trim()
	);
</script>

<span
	class={combinedClasses}
	role={isDecorative ? undefined : 'img'}
	aria-label={ariaLabel}
	aria-hidden={isDecorative ? 'true' : undefined}
>
	{@render children?.()}
</span>
