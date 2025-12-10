<script lang="ts">
	import type { Snippet } from "svelte";

	type Step = {
		id: string;
		label: string;
		description?: string;
	};

	type StepStatus = 'complete' | 'current' | 'upcoming';

	interface StepperProps {
		/** Custom class names */
		class?: string;
		/** Steps configuration */
		steps: Step[];
		/** Current step index (0-based) */
		currentStep?: number;
		/** Orientation */
		orientation?: 'horizontal' | 'vertical';
		/** Callback when step is clicked */
		onstepclick?: (stepIndex: number) => void;
		/** Whether steps are clickable */
		clickable?: boolean;
	}

	let {
		class: className = '',
		steps,
		currentStep = $bindable(0),
		orientation = 'horizontal',
		onstepclick,
		clickable = false
	}: StepperProps = $props();

	function getStepStatus(index: number): StepStatus {
		if (index < currentStep) return 'complete';
		if (index === currentStep) return 'current';
		return 'upcoming';
	}

	function handleStepClick(index: number) {
		if (!clickable) return;
		currentStep = index;
		onstepclick?.(index);
	}
</script>

<nav aria-label="Progress" class={className}>
	{#if orientation === 'horizontal'}
		<ol class="flex items-center">
			{#each steps as step, i (step.id)}
				<li class="flex-1 {i < steps.length - 1 ? 'pr-2 sm:pr-4' : ''}">
					<button
						type="button"
						class="group flex flex-col items-center w-full {clickable ? 'cursor-pointer' : 'cursor-default'}"
						disabled={!clickable}
						onclick={() => handleStepClick(i)}
						aria-current={getStepStatus(i) === 'current' ? 'step' : undefined}
					>
						<div class="flex items-center w-full">
							<div class="flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-colors
								{getStepStatus(i) === 'complete' ? 'bg-[var(--caroline-blue-700)] text-white' : ''}
								{getStepStatus(i) === 'current' ? 'border-2 border-[var(--caroline-blue-700)] bg-[var(--sandy-tan-200)] text-[var(--caroline-blue-700)]' : ''}
								{getStepStatus(i) === 'upcoming' ? 'border-2 border-[var(--liver-brown-400)] bg-[var(--sandy-tan-200)] text-[var(--liver-brown-500)]' : ''}"
							>
								{#if getStepStatus(i) === 'complete'}
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
										<polyline points="20 6 9 17 4 12"/>
									</svg>
								{:else}
									<span class="text-sm font-medium">{i + 1}</span>
								{/if}
							</div>

							{#if i < steps.length - 1}
								<div class="flex-1 h-0.5 mx-2
									{getStepStatus(i) === 'complete' ? 'bg-[var(--caroline-blue-700)]' : 'bg-[var(--liver-brown-400)]'}"
								></div>
							{/if}
						</div>

						<div class="mt-2 text-center">
							<span class="text-sm font-medium
								{getStepStatus(i) === 'current' ? 'text-[var(--caroline-blue-700)]' : 'text-[var(--liver-brown-700)]'}">
								{step.label}
							</span>
							{#if step.description}
								<p class="text-xs text-[var(--liver-brown-500)] mt-0.5 hidden sm:block">
									{step.description}
								</p>
							{/if}
						</div>
					</button>
				</li>
			{/each}
		</ol>
	{:else}
		<ol class="flex flex-col">
			{#each steps as step, i (step.id)}
				<li class="relative {i < steps.length - 1 ? 'pb-8' : ''}">
					{#if i < steps.length - 1}
						<div class="absolute left-4 top-8 bottom-0 w-0.5 -ml-px
							{getStepStatus(i) === 'complete' ? 'bg-[var(--caroline-blue-700)]' : 'bg-[var(--liver-brown-400)]'}"
						></div>
					{/if}

					<button
						type="button"
						class="group flex items-start gap-4 w-full text-left {clickable ? 'cursor-pointer' : 'cursor-default'}"
						disabled={!clickable}
						onclick={() => handleStepClick(i)}
						aria-current={getStepStatus(i) === 'current' ? 'step' : undefined}
					>
						<div class="flex items-center justify-center w-8 h-8 rounded-full shrink-0 z-10 transition-colors
							{getStepStatus(i) === 'complete' ? 'bg-[var(--caroline-blue-700)] text-white' : ''}
							{getStepStatus(i) === 'current' ? 'border-2 border-[var(--caroline-blue-700)] bg-[var(--sandy-tan-200)] text-[var(--caroline-blue-700)]' : ''}
							{getStepStatus(i) === 'upcoming' ? 'border-2 border-[var(--liver-brown-400)] bg-[var(--sandy-tan-200)] text-[var(--liver-brown-500)]' : ''}"
						>
							{#if getStepStatus(i) === 'complete'}
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
									<polyline points="20 6 9 17 4 12"/>
								</svg>
							{:else}
								<span class="text-sm font-medium">{i + 1}</span>
							{/if}
						</div>

						<div class="pt-1">
							<span class="text-sm font-medium
								{getStepStatus(i) === 'current' ? 'text-[var(--caroline-blue-700)]' : 'text-[var(--liver-brown-700)]'}">
								{step.label}
							</span>
							{#if step.description}
								<p class="text-xs text-[var(--liver-brown-500)] mt-0.5">
									{step.description}
								</p>
							{/if}
						</div>
					</button>
				</li>
			{/each}
		</ol>
	{/if}
</nav>

