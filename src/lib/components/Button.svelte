<script lang="ts">
	import type { Snippet } from "svelte";

	interface ButtonProps extends svelteHTML.HTMLAttributes<HTMLButtonElement> {
		class?: string;
		variant?: 'primary' | 'secondary' | 'outline';
		children?: Snippet;
	}

	let {
		class: className = '',
		variant = 'primary',
		children,
		...buttonProps
	}: ButtonProps = $props();

	const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";
	
	const variantClasses = {
		primary: "bg-[var(--caroline-blue-700)] text-white hover:bg-[var(--caroline-blue-800)] focus:ring-[var(--caroline-blue-500)] border-2 border-[var(--liver-brown-500)]",
		secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
		outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
	};

	const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;
</script>

<button 
	class={combinedClasses}
	{...buttonProps}
>
	{@render children?.()}
</button>