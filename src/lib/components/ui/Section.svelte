<script lang="ts">
	import type { Snippet } from "svelte";

	type SectionSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl';
	type SectionBackground = 'transparent' | 'muted' | 'accent' | 'primary';

	interface SectionProps {
		/** Custom class names */
		class?: string;
		/** Vertical padding/spacing */
		spacing?: SectionSpacing;
		/** Background variant */
		background?: SectionBackground;
		/** Accessible label for the section */
		'aria-label'?: string;
		/** ID of element that labels this section */
		'aria-labelledby'?: string;
		children?: Snippet;
	}

	let {
		class: className = '',
		spacing = 'md',
		background = 'transparent',
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		children
	}: SectionProps = $props();

	const spacingClasses: Record<SectionSpacing, string> = {
		none: '',
		sm: 'py-4 sm:py-6',
		md: 'py-8 sm:py-12',
		lg: 'py-12 sm:py-16',
		xl: 'py-16 sm:py-24'
	};

	const backgroundClasses: Record<SectionBackground, string> = {
		transparent: '',
		muted: 'bg-[var(--sandy-tan-300)]',
		accent: 'bg-[var(--sandy-tan-500)]',
		primary: 'bg-[var(--caroline-blue-100)]'
	};

	const combinedClasses = $derived(
		`${spacingClasses[spacing]} ${backgroundClasses[background]} ${className}`.trim()
	);
</script>

<section
	class={combinedClasses}
	aria-label={ariaLabel}
	aria-labelledby={ariaLabelledby}
>
	{@render children?.()}
</section>
