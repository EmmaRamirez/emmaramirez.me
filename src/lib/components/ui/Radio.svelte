<script lang="ts">
	interface RadioProps extends Omit<svelteHTML.HTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'value'> {
		/** Custom class names */
		class?: string;
		/** Label text */
		label?: string;
		/** Radio group name */
		name: string;
		/** Value for this option */
		value: string;
		/** Currently selected value in the group */
		group?: string;
		/** Input ID */
		id?: string;
		/** Description text below label */
		description?: string;
	}

	let {
		class: className = '',
		label,
		name,
		value,
		group = $bindable(''),
		id,
		description,
		...inputProps
	}: RadioProps = $props();

	const generatedId = `radio-${Math.random().toString(36).slice(2, 9)}`;
	const inputId = $derived(id ?? generatedId);
</script>

<div class="flex items-start gap-3 {className}">
	<div class="relative flex items-center">
		<input
			type="radio"
			id={inputId}
			{name}
			{value}
			class="peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-[var(--liver-brown-500)] bg-[var(--eggshell-white-500)] transition-colors duration-200 checked:border-[var(--caroline-blue-700)] focus:outline-none focus:ring-2 focus:ring-[var(--caroline-blue-500)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
			bind:group
			aria-describedby={description ? `${inputId}-description` : undefined}
			{...inputProps}
		/>
		<!-- Inner dot -->
		<div 
			class="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--caroline-blue-700)] opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"
		></div>
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
		</div>
	{/if}
</div>

