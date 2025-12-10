<script lang="ts">
	type SelectOption = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	interface SelectProps extends Omit<svelteHTML.HTMLAttributes<HTMLSelectElement>, 'value'> {
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
		/** Selected value */
		value?: string;
		/** Array of options */
		options: SelectOption[];
		/** Placeholder text */
		placeholder?: string;
	}

	let {
		class: className = '',
		label,
		error,
		hint,
		id,
		value = $bindable(''),
		options,
		placeholder,
		...selectProps
	}: SelectProps = $props();

	const generatedId = `select-${Math.random().toString(36).slice(2, 9)}`;
	const inputId = $derived(id ?? generatedId);

	const baseSelectClasses = "w-full px-3 py-2 pr-10 rounded-lg border-2 bg-[var(--eggshell-white-500)] text-[var(--liver-brown-800)] focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer";
	
	const stateClasses = error
		? "border-red-500 focus:ring-red-400"
		: "border-[var(--liver-brown-500)] focus:ring-[var(--caroline-blue-500)] focus:border-[var(--caroline-blue-600)]";

	const combinedSelectClasses = `${baseSelectClasses} ${stateClasses} ${className}`;
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
	
	<div class="relative">
		<select
			id={inputId}
			class={combinedSelectClasses}
			bind:value
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
			{...selectProps}
		>
			{#if placeholder}
				<option value="" disabled>{placeholder}</option>
			{/if}
			{#each options as option (option.value)}
				<option value={option.value} disabled={option.disabled}>
					{option.label}
				</option>
			{/each}
		</select>
		
		<div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--liver-brown-600)]">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="m6 9 6 6 6-6"/>
			</svg>
		</div>
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

