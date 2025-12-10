<script lang="ts">
	interface CheckboxProps extends Omit<svelteHTML.HTMLAttributes<HTMLInputElement>, 'type' | 'checked'> {
		/** Custom class names */
		class?: string;
		/** Label text */
		label?: string;
		/** Checked state */
		checked?: boolean;
		/** Indeterminate state (for "select all" patterns) */
		indeterminate?: boolean;
		/** Input ID */
		id?: string;
		/** Description text below label */
		description?: string;
		/** Error message */
		error?: string;
	}

	let {
		class: className = '',
		label,
		checked = $bindable(false),
		indeterminate = false,
		id,
		description,
		error,
		...inputProps
	}: CheckboxProps = $props();

	const generatedId = `checkbox-${Math.random().toString(36).slice(2, 9)}`;
	const inputId = $derived(id ?? generatedId);
</script>

<div class="flex items-start gap-3 {className}">
	<div class="relative flex items-center">
		<input
			type="checkbox"
			id={inputId}
			class="peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded border-2 border-[var(--liver-brown-500)] bg-[var(--eggshell-white-500)] transition-colors duration-200 checked:bg-[var(--caroline-blue-700)] checked:border-[var(--caroline-blue-700)] focus:outline-none focus:ring-2 focus:ring-[var(--caroline-blue-500)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
			bind:checked
			{indeterminate}
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={description ? `${inputId}-description` : undefined}
			{...inputProps}
		/>
		<svg 
			class="absolute left-0.5 top-0.5 h-4 w-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
			xmlns="http://www.w3.org/2000/svg" 
			viewBox="0 0 24 24" 
			fill="none" 
			stroke="currentColor" 
			stroke-width="3" 
			stroke-linecap="round" 
			stroke-linejoin="round"
		>
			<path d="M20 6 9 17l-5-5"/>
		</svg>
		{#if indeterminate}
			<svg 
				class="absolute left-0.5 top-0.5 h-4 w-4 text-white pointer-events-none"
				xmlns="http://www.w3.org/2000/svg" 
				viewBox="0 0 24 24" 
				fill="none" 
				stroke="currentColor" 
				stroke-width="3" 
				stroke-linecap="round"
			>
				<path d="M5 12h14"/>
			</svg>
		{/if}
	</div>
	
	{#if label || description}
		<div class="flex flex-col gap-0.5">
			{#if label}
				<label 
					for={inputId} 
					class="text-sm font-medium text-[var(--liver-brown-800)] cursor-pointer select-none"
				>
					{label}
				</label>
			{/if}
			{#if description}
				<p id="{inputId}-description" class="text-sm text-[var(--liver-brown-600)]">
					{description}
				</p>
			{/if}
			{#if error}
				<p class="text-sm text-red-600" role="alert">
					{error}
				</p>
			{/if}
		</div>
	{/if}
</div>

