<script lang="ts">
	import type { Snippet } from "svelte";

	type AlertVariant = 'info' | 'success' | 'warning' | 'error';

	interface AlertProps {
		/** Custom class names */
		class?: string;
		/** Visual variant */
		variant?: AlertVariant;
		/** Alert title */
		title?: string;
		/** Show dismiss button */
		dismissible?: boolean;
		/** Callback when dismissed */
		ondismiss?: () => void;
		/** Alert content */
		children?: Snippet;
		/** Custom icon */
		icon?: Snippet;
	}

	let {
		class: className = '',
		variant = 'info',
		title,
		dismissible = false,
		ondismiss,
		children,
		icon
	}: AlertProps = $props();

	const variantClasses: Record<AlertVariant, { container: string; icon: string; title: string }> = {
		info: {
			container: 'bg-blue-50 border-blue-400 text-blue-800',
			icon: 'text-blue-500',
			title: 'text-blue-900'
		},
		success: {
			container: 'bg-green-50 border-green-400 text-green-800',
			icon: 'text-green-500',
			title: 'text-green-900'
		},
		warning: {
			container: 'bg-[var(--transit-yellow-100)] border-[var(--transit-yellow-600)] text-[var(--liver-brown-800)]',
			icon: 'text-[var(--transit-yellow-700)]',
			title: 'text-[var(--liver-brown-900)]'
		},
		error: {
			container: 'bg-red-50 border-red-400 text-red-800',
			icon: 'text-red-500',
			title: 'text-red-900'
		}
	};

	const defaultIcons: Record<AlertVariant, string> = {
		info: 'M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z',
		success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
		error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
	};
</script>

<div
	class="flex gap-3 p-4 rounded-lg border-l-4 {variantClasses[variant].container} {className}"
	role="alert"
>
	<div class="shrink-0 {variantClasses[variant].icon}">
		{#if icon}
			{@render icon()}
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d={defaultIcons[variant]}></path>
			</svg>
		{/if}
	</div>

	<div class="flex-1 min-w-0">
		{#if title}
			<h3 class="font-semibold mb-1 {variantClasses[variant].title}">
				{title}
			</h3>
		{/if}
		<div class="text-sm">
			{@render children?.()}
		</div>
	</div>

	{#if dismissible}
		<button
			type="button"
			class="shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
			onclick={ondismiss}
			aria-label="Dismiss"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
	{/if}
</div>

