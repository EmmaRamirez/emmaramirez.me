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
		sm: 'w-4 h-4',    // 16px
		md: 'w-5 h-5',    // 20px
		lg: 'w-6 h-6',    // 24px
		xl: 'w-8 h-8'     // 32px
	};

	// If no aria-label, icon is decorative
	const isDecorative = !ariaLabel;

	const combinedClasses = `inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`.trim();
</script>

<span
	class={combinedClasses}
	role={isDecorative ? undefined : 'img'}
	aria-label={ariaLabel}
	aria-hidden={isDecorative ? 'true' : undefined}
>
	{@render children?.()}
</span>

