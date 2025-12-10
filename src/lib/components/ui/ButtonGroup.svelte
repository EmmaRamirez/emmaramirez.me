<script lang="ts">
	import type { Snippet } from "svelte";

	interface ButtonGroupProps extends svelteHTML.HTMLAttributes<HTMLDivElement> {
		class?: string;
		orientation?: 'horizontal' | 'vertical';
		children?: Snippet;
	}

	let {
		class: className = '',
		orientation = 'horizontal',
		children,
		...divProps
	}: ButtonGroupProps = $props();

	const baseClasses = "inline-flex";
	
	const orientationClasses = {
		horizontal: "flex-row [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:border-l-0",
		vertical: "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:border-t-0"
	};

	const combinedClasses = `${baseClasses} ${orientationClasses[orientation]} ${className}`;
</script>

<div 
	class={combinedClasses}
	role="group"
	{...divProps}
>
	{@render children?.()}
</div>

