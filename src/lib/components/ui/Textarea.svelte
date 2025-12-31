<script lang="ts">
	import type { Snippet } from "svelte";

	type ResizeOption = 'none' | 'vertical' | 'horizontal' | 'both';

	interface TextareaProps extends Omit<svelteHTML.HTMLAttributes<HTMLTextAreaElement>, 'value'> {
		/** Custom class names */
		class?: string;
		/** Label text */
		label?: string;
		/** Error message */
		error?: string;
		/** Hint/helper text */
		hint?: string;
		/** Input ID */
		id?: string;
		/** Current value */
		value?: string;
		/** Number of visible rows */
		rows?: number;
		/** Maximum character count */
		maxlength?: number;
		/** Show character count */
		showCount?: boolean;
		/** Resize behavior */
		resize?: ResizeOption;
	}

	let {
		class: className = '',
		label,
		error,
		hint,
		id,
		value = $bindable(''),
		rows = 4,
		maxlength,
		showCount = false,
		resize = 'vertical',
		...textareaProps
	}: TextareaProps = $props();

	const generatedId = `textarea-${Math.random().toString(36).slice(2, 9)}`;
	const inputId = $derived(id ?? generatedId);
	const charCount = $derived(value.length);

	const resizeClasses: Record<ResizeOption, string> = {
		none: 'resize-none',
		vertical: 'resize-y',
		horizontal: 'resize-x',
		both: 'resize'
	};

	const baseTextareaClasses = "w-full px-3 py-2 rounded-lg border-2 bg-[var(--eggshell-white-500)] text-[var(--liver-brown-800)] placeholder:text-[var(--liver-brown-500)] focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
	
	const stateClasses = $derived(
		error
			? "border-red-500 focus:ring-red-400"
			: "border-[var(--liver-brown-500)] focus:ring-[var(--caroline-blue-500)] focus:border-[var(--caroline-blue-600)]"
	);

	const combinedTextareaClasses = $derived(
		`${baseTextareaClasses} ${stateClasses} ${resizeClasses[resize]} ${className}`
	);
</script>

<div class="flex flex-col gap-1.5">
	{#if label}
		<label 
			for={inputId} 
			class="text-sm font-medium text-[var(--liver-brown-700)]"
		>
			{label}
		</label>
	{/if}
	
	<textarea
		id={inputId}
		class={combinedTextareaClasses}
		{rows}
		{maxlength}
		bind:value
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
		{...textareaProps}
	></textarea>
	
	<div class="flex justify-between gap-2">
		{#if error}
			<p id="{inputId}-error" class="text-sm text-red-600" role="alert">
				{error}
			</p>
		{:else if hint}
			<p id="{inputId}-hint" class="text-sm text-[var(--liver-brown-600)]">
				{hint}
			</p>
		{:else}
			<span></span>
		{/if}
		
		{#if showCount}
			<span class="text-sm text-[var(--liver-brown-600)] shrink-0">
				{charCount}{#if maxlength}/{maxlength}{/if}
			</span>
		{/if}
	</div>
</div>
