<script lang="ts">
	type SwitchSize = 'sm' | 'md' | 'lg';

	interface SwitchProps extends Omit<svelteHTML.HTMLAttributes<HTMLButtonElement>, 'type'> {
		/** Custom class names */
		class?: string;
		/** Label text */
		label?: string;
		/** Checked/on state */
		checked?: boolean;
		/** Switch size */
		size?: SwitchSize;
		/** Input ID */
		id?: string;
		/** Description text */
		description?: string;
		/** Disabled state */
		disabled?: boolean;
	}

	let {
		class: className = '',
		label,
		checked = $bindable(false),
		size = 'md',
		id,
		description,
		disabled = false,
		...buttonProps
	}: SwitchProps = $props();

	const generatedId = `switch-${Math.random().toString(36).slice(2, 9)}`;
	const inputId = $derived(id ?? generatedId);

	const sizeClasses: Record<SwitchSize, { track: string; thumb: string; translate: string }> = {
		sm: { track: 'h-5 w-9', thumb: 'h-4 w-4', translate: 'translate-x-4' },
		md: { track: 'h-6 w-11', thumb: 'h-5 w-5', translate: 'translate-x-5' },
		lg: { track: 'h-7 w-14', thumb: 'h-6 w-6', translate: 'translate-x-7' }
	};

	function toggle() {
		if (!disabled) {
			checked = !checked;
		}
	}
</script>

<div class="flex items-start gap-3 {className}">
	<button
		type="button"
		role="switch"
		id={inputId}
		aria-checked={checked}
		aria-describedby={description ? `${inputId}-description` : undefined}
		class="relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--caroline-blue-500)] focus:ring-offset-2 {sizeClasses[size].track} {checked ? 'bg-[var(--caroline-blue-700)]' : 'bg-[var(--sandy-tan-600)]'} {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
		{disabled}
		onclick={toggle}
		{...buttonProps}
	>
		<span class="sr-only">{label ?? 'Toggle'}</span>
		<span
			class="pointer-events-none inline-block rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out {sizeClasses[size].thumb} {checked ? sizeClasses[size].translate : 'translate-x-0'}"
		></span>
	</button>
	
	{#if label || description}
		<div class="flex flex-col gap-0.5">
			{#if label}
				<label 
					for={inputId} 
					class="text-sm font-medium text-[var(--liver-brown-800)] cursor-pointer select-none"
					onclick={toggle}
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

