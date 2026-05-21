<script lang="ts">
	import type { Snippet } from 'svelte';

	type TypographyVariant =
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6'
		| 'p'
		| 'span'
		| 'small'
		| 'lead'
		| 'code'
		| 'link';
	type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold';
	type TypographyColor = 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error';

	interface TypographyProps {
		class?: string;
		variant?: TypographyVariant;
		as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'small' | 'div' | 'code' | 'a';
		weight?: TypographyWeight;
		color?: TypographyColor;
		/** Used when variant is 'link' - the URL to navigate to */
		href?: string;
		/** Used when variant is 'link' - where to open the link */
		target?: '_self' | '_blank' | '_parent' | '_top';
		children?: Snippet;
	}

	let {
		class: className = '',
		variant = 'p',
		as,
		weight,
		color = 'default',
		href,
		target,
		children
	}: TypographyProps = $props();

	const variantStyles: Record<TypographyVariant, string> = {
		h1: 'text-4xl font-bold tracking-tight',
		h2: 'text-3xl font-bold tracking-tight',
		h3: 'text-2xl font-semibold tracking-wide',
		h4: 'text-xl font-semibold',
		h5: 'text-lg font-medium',
		h6: 'text-base font-medium',
		p: 'text-base',
		span: 'text-base',
		small: 'text-sm',
		lead: 'text-xl text-[var(--liver-brown-600)]',
		code: 'font-mono text-sm bg-[var(--sandy-tan-400)] px-1.5 py-0.5 rounded border border-[var(--liver-brown-500)]',
		link: 'text-base underline text-[var(--caroline-blue-700)] hover:text-[var(--caroline-blue-900)] transition-colors duration-200 cursor-pointer'
	};

	const weightStyles: Record<TypographyWeight, string> = {
		normal: 'font-normal',
		medium: 'font-medium',
		semibold: 'font-semibold',
		bold: 'font-bold'
	};

	const colorStyles: Record<TypographyColor, string> = {
		default: 'text-[var(--liver-brown-800)]',
		muted: 'text-[var(--liver-brown-600)]',
		primary: 'text-[var(--caroline-blue-700)]',
		success: 'text-[var(--lawn-green-700)]',
		warning: 'text-[var(--transit-yellow-800)]',
		error: 'text-red-600'
	};

	const defaultElements: Record<TypographyVariant, string> = {
		h1: 'h1',
		h2: 'h2',
		h3: 'h3',
		h4: 'h4',
		h5: 'h5',
		h6: 'h6',
		p: 'p',
		span: 'span',
		small: 'small',
		lead: 'p',
		code: 'code',
		link: 'a'
	};

	const element = $derived(as ?? defaultElements[variant]);
	const effectiveColor = $derived(
		variant === 'link' ? (color === 'default' ? 'primary' : color) : color
	);
	const shouldApplyColorStyles = $derived(variant !== 'link' && variant !== 'code');

	const combinedClasses = $derived(
		`${variantStyles[variant]} ${weight ? weightStyles[weight] : ''} ${shouldApplyColorStyles ? colorStyles[effectiveColor] : ''} ${className}`.trim()
	);
</script>

{#if element === 'h1'}
	<h1 class={combinedClasses}>{@render children?.()}</h1>
{:else if element === 'h2'}
	<h2 class={combinedClasses}>{@render children?.()}</h2>
{:else if element === 'h3'}
	<h3 class={combinedClasses}>{@render children?.()}</h3>
{:else if element === 'h4'}
	<h4 class={combinedClasses}>{@render children?.()}</h4>
{:else if element === 'h5'}
	<h5 class={combinedClasses}>{@render children?.()}</h5>
{:else if element === 'h6'}
	<h6 class={combinedClasses}>{@render children?.()}</h6>
{:else if element === 'span'}
	<span class={combinedClasses}>{@render children?.()}</span>
{:else if element === 'small'}
	<small class={combinedClasses}>{@render children?.()}</small>
{:else if element === 'div'}
	<div class={combinedClasses}>{@render children?.()}</div>
{:else if element === 'code'}
	<code class={combinedClasses}>{@render children?.()}</code>
{:else if element === 'a'}
	<a
		class={[combinedClasses, 'style-none']}
		{href}
		{target}
		rel={target === '_blank' ? 'noopener noreferrer' : undefined}
	>
		{@render children?.()}
	</a>
{:else}
	<p class={combinedClasses}>{@render children?.()}</p>
{/if}
