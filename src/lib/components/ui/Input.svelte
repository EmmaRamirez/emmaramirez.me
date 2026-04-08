<script lang="ts">
	import type { Snippet } from 'svelte';

	interface InputProps extends Omit<svelteHTML.HTMLAttributes<HTMLInputElement>, 'type'> {
		class?: string;
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
		label?: string;
		error?: string;
		hint?: string;
		id?: string;
		value?: string;
		leadingIcon?: Snippet;
		trailingIcon?: Snippet;
	}

	let {
		class: className = '',
		type = 'text',
		label,
		error,
		hint,
		id,
		value = $bindable(''),
		leadingIcon,
		trailingIcon,
		...inputProps
	}: InputProps = $props();

	const generatedId = `input-${Math.random().toString(36).slice(2, 9)}`;
	const inputId = $derived(id ?? generatedId);

	const baseInputClasses =
		'w-full px-3 py-2 rounded-lg border-2 bg-[var(--eggshell-white-500)] text-[var(--liver-brown-800)] placeholder:text-[var(--liver-brown-500)] focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

	const stateClasses = $derived(
		error
			? 'border-red-500 focus:ring-red-400'
			: 'border-[var(--liver-brown-500)] focus:ring-[var(--caroline-blue-500)] focus:border-[var(--caroline-blue-600)]'
	);

	const hasLeadingIcon = $derived(leadingIcon !== undefined);
	const hasTrailingIcon = $derived(trailingIcon !== undefined);

	const paddingClasses = $derived(
		`${hasLeadingIcon ? 'pl-10' : ''} ${hasTrailingIcon ? 'pr-10' : ''}`
	);

	const combinedInputClasses = $derived(
		`${baseInputClasses} ${stateClasses} ${paddingClasses} ${className}`
	);
</script>

<div class="flex flex-col gap-1.5">
	{#if label}
		<label for={inputId} class="text-sm font-medium text-[var(--liver-brown-700)]">
			{label}
		</label>
	{/if}

	<div class="relative">
		{#if leadingIcon}
			<div class="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--liver-brown-500)]">
				{@render leadingIcon()}
			</div>
		{/if}

		<input
			{type}
			id={inputId}
			class={combinedInputClasses}
			bind:value
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
			{...inputProps}
		/>

		{#if trailingIcon}
			<div class="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--liver-brown-500)]">
				{@render trailingIcon()}
			</div>
		{/if}
	</div>

	{#if error}
		<p id="{inputId}-error" class="text-sm text-red-600" role="alert">
			{error}
		</p>
	{:else if hint}
		<p id="{inputId}-hint" class="text-sm text-[var(--liver-brown-600)]">
			{hint}
		</p>
	{/if}
</div>
