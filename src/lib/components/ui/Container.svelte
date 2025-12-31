<script lang="ts">
	import type { Snippet } from "svelte";

	type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

	interface ContainerProps {
		/** Custom class names */
		class?: string;
		/** Maximum width constraint */
		size?: ContainerSize;
		/** Horizontal padding */
		padding?: 'none' | 'sm' | 'md' | 'lg';
		/** Center the container horizontally */
		centered?: boolean;
		children?: Snippet;
	}

	let {
		class: className = '',
		size = 'lg',
		padding = 'md',
		centered = true,
		children
	}: ContainerProps = $props();

	const sizeClasses: Record<ContainerSize, string> = {
		sm: 'max-w-screen-sm',   // 640px
		md: 'max-w-screen-md',   // 768px
		lg: 'max-w-screen-lg',   // 1024px
		xl: 'max-w-screen-xl',   // 1280px
		full: 'max-w-full'
	};

	const paddingClasses: Record<string, string> = {
		none: '',
		sm: 'px-4',
		md: 'px-6 sm:px-8',
		lg: 'px-8 sm:px-12'
	};

	const combinedClasses = $derived(
		`w-full ${sizeClasses[size]} ${paddingClasses[padding]} ${centered ? 'mx-auto' : ''} ${className}`.trim()
	);
</script>

<div class={combinedClasses}>
	{@render children?.()}
</div>
