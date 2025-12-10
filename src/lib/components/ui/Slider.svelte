<script lang="ts">
	interface SliderProps extends Omit<svelteHTML.HTMLAttributes<HTMLInputElement>, 'type'> {
		class?: string;
		label?: string;
		min?: number;
		max?: number;
		step?: number;
		value?: number;
		showValue?: boolean;
		id?: string;
	}

	let {
		class: className = '',
		label,
		min = 0,
		max = 100,
		step = 1,
		value = $bindable(50),
		showValue = true,
		id,
		...inputProps
	}: SliderProps = $props();

	const generatedId = `slider-${Math.random().toString(36).slice(2, 9)}`;
	const inputId = $derived(id ?? generatedId);

	// Calculate percentage for track fill
	const percentage = $derived(((value - min) / (max - min)) * 100);
</script>

<div class="flex flex-col gap-1.5 {className}">
	{#if label}
		<div class="flex items-center justify-between">
			<label 
				for={inputId} 
				class="text-sm font-medium text-[var(--liver-brown-700)]"
			>
				{label}
			</label>
			{#if showValue}
				<span class="text-sm font-medium text-[var(--liver-brown-600)]">
					{value}
				</span>
			{/if}
		</div>
	{/if}
	
	<div class="relative flex items-center">
		<input
			type="range"
			id={inputId}
			class="slider-input h-2 w-full cursor-pointer appearance-none rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
			{min}
			{max}
			{step}
			bind:value
			style="--slider-percentage: {percentage}%"
			{...inputProps}
		/>
	</div>
	
	{#if !label && showValue}
		<div class="flex justify-end">
			<span class="text-sm font-medium text-[var(--liver-brown-600)]">
				{value}
			</span>
		</div>
	{/if}
</div>

<style>
	.slider-input {
		background: linear-gradient(
			to right,
			var(--caroline-blue-600) 0%,
			var(--caroline-blue-600) var(--slider-percentage),
			var(--sandy-tan-600) var(--slider-percentage),
			var(--sandy-tan-600) 100%
		);
	}

	.slider-input::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		background: var(--caroline-blue-700);
		border: 2px solid var(--liver-brown-500);
		border-radius: 50%;
		cursor: pointer;
		transition: transform 0.15s ease, background-color 0.15s ease;
	}

	.slider-input::-webkit-slider-thumb:hover {
		transform: scale(1.1);
		background: var(--caroline-blue-800);
	}

	.slider-input::-moz-range-thumb {
		width: 18px;
		height: 18px;
		background: var(--caroline-blue-700);
		border: 2px solid var(--liver-brown-500);
		border-radius: 50%;
		cursor: pointer;
		transition: transform 0.15s ease, background-color 0.15s ease;
	}

	.slider-input::-moz-range-thumb:hover {
		transform: scale(1.1);
		background: var(--caroline-blue-800);
	}

	.slider-input:focus {
		outline: none;
	}

	.slider-input:focus::-webkit-slider-thumb {
		box-shadow: 0 0 0 3px var(--caroline-blue-200);
	}

	.slider-input:focus::-moz-range-thumb {
		box-shadow: 0 0 0 3px var(--caroline-blue-200);
	}
</style>

