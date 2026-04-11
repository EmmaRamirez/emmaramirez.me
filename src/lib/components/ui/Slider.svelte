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
	const percentage = $derived(((value - min) / (max - min)) * 100);
</script>

<div class="flex flex-col gap-1.5 {className}">
	{#if label}
		<div class="flex items-center justify-between">
			<label for={inputId} class="text-sm font-medium text-[var(--liver-brown-700)]">
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
			class="slider-input h-2 w-full cursor-pointer appearance-none rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
			{min}
			{max}
			{step}
			style="--slider-percentage: {percentage}%"
			{...inputProps}
			bind:value
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
			var(--slider-track-filled) 0%,
			var(--slider-track-filled) var(--slider-percentage),
			var(--slider-track-empty) var(--slider-percentage),
			var(--slider-track-empty) 100%
		);
	}

	.slider-input::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 1.125rem;
		height: 1.125rem;
		background: var(--slider-thumb-bg);
		border: 0.125rem solid var(--slider-thumb-border);
		border-radius: 50%;
		box-shadow: var(--slider-thumb-shadow);
		cursor: pointer;
		transition:
			transform 0.15s ease,
			background-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.slider-input::-webkit-slider-thumb:hover {
		transform: scale(1.08);
		background: var(--slider-thumb-hover-bg);
	}

	.slider-input::-moz-range-thumb {
		width: 1.125rem;
		height: 1.125rem;
		background: var(--slider-thumb-bg);
		border: 0.125rem solid var(--slider-thumb-border);
		border-radius: 50%;
		box-shadow: var(--slider-thumb-shadow);
		cursor: pointer;
		transition:
			transform 0.15s ease,
			background-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.slider-input::-moz-range-thumb:hover {
		transform: scale(1.08);
		background: var(--slider-thumb-hover-bg);
	}

	.slider-input:focus {
		outline: none;
	}

	.slider-input:focus::-webkit-slider-thumb {
		box-shadow:
			0 0 0 0.1875rem var(--slider-focus-ring),
			var(--slider-thumb-shadow);
	}

	.slider-input:focus::-moz-range-thumb {
		box-shadow:
			0 0 0 0.1875rem var(--slider-focus-ring),
			var(--slider-thumb-shadow);
	}
</style>
