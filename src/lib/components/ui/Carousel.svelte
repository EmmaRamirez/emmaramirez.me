<script lang="ts">
	import type { Snippet } from 'svelte';

	interface CarouselProps {
		/** Custom class names */
		class?: string;
		/** Number of slides */
		slideCount: number;
		/** Current slide index */
		currentSlide?: number;
		/** Auto-play interval in ms (0 = disabled) */
		autoPlay?: number;
		/** Show navigation arrows */
		showArrows?: boolean;
		/** Show dot indicators */
		showDots?: boolean;
		/** Callback when slide changes */
		onchange?: (index: number) => void;
		/** Slide content */
		children?: Snippet<[number]>;
	}

	let {
		class: className = '',
		slideCount,
		currentSlide = $bindable(0),
		autoPlay = 0,
		showArrows = true,
		showDots = true,
		onchange,
		children
	}: CarouselProps = $props();

	let intervalId: ReturnType<typeof setInterval> | null = null;

	function goToSlide(index: number) {
		currentSlide = (index + slideCount) % slideCount;
		onchange?.(currentSlide);
	}

	function prev() {
		goToSlide(currentSlide - 1);
	}

	function next() {
		goToSlide(currentSlide + 1);
	}

	$effect(() => {
		if (autoPlay > 0) {
			intervalId = setInterval(() => {
				next();
			}, autoPlay);
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	});

	let isPaused = $state(false);

	$effect(() => {
		if (isPaused && intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		} else if (!isPaused && autoPlay > 0 && !intervalId) {
			intervalId = setInterval(() => {
				next();
			}, autoPlay);
		}
	});
</script>

<div
	class="relative overflow-hidden rounded-xl {className}"
	role="region"
	aria-roledescription="carousel"
	aria-label="Image carousel"
	onmouseenter={() => (isPaused = true)}
	onmouseleave={() => (isPaused = false)}
>
	<div
		class="flex transition-transform duration-500 ease-out"
		style="transform: translateX(-{currentSlide * 100}%)"
	>
		{#each Array(slideCount) as _, i (i)}
			<div
				class="w-full flex-shrink-0"
				role="group"
				aria-roledescription="slide"
				aria-label="Slide {i + 1} of {slideCount}"
				aria-hidden={i !== currentSlide}
			>
				{#if children}
					{@render children(i)}
				{/if}
			</div>
		{/each}
	</div>

	{#if showArrows && slideCount > 1}
		<button
			type="button"
			class="absolute top-1/2 left-2 -translate-y-1/2 rounded-full border-2 border-[var(--liver-brown-500)] bg-[var(--sandy-tan-200)]/90 p-2 text-[var(--liver-brown-700)] shadow-lg transition-colors hover:bg-[var(--sandy-tan-300)]"
			onclick={prev}
			aria-label="Previous slide"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="m15 18-6-6 6-6" />
			</svg>
		</button>

		<button
			type="button"
			class="absolute top-1/2 right-2 -translate-y-1/2 rounded-full border-2 border-[var(--liver-brown-500)] bg-[var(--sandy-tan-200)]/90 p-2 text-[var(--liver-brown-700)] shadow-lg transition-colors hover:bg-[var(--sandy-tan-300)]"
			onclick={next}
			aria-label="Next slide"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="m9 18 6-6-6-6" />
			</svg>
		</button>
	{/if}

	{#if showDots && slideCount > 1}
		<div class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
			{#each Array(slideCount) as _, i (i)}
				<button
					type="button"
					class="h-2.5 w-2.5 rounded-full transition-colors
						{i === currentSlide
						? 'bg-[var(--caroline-blue-700)]'
						: 'bg-[var(--sandy-tan-200)]/70 hover:bg-[var(--sandy-tan-200)]'}"
					onclick={() => goToSlide(i)}
					aria-label="Go to slide {i + 1}"
					aria-current={i === currentSlide ? 'true' : undefined}
				></button>
			{/each}
		</div>
	{/if}
</div>
