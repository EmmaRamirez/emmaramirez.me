<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Bloblet3 } from '$lib/components/graphics';
	import { ColorPicker } from '$lib/components/dev';
	import { Button } from '$lib/components/ui';

	let startColor = $state('var(--caroline-blue-500)');
	let stopColor = $state('var(--caroline-blue-700)');
	let numPoints = $state(12);
	let radius = $state(55);
	let baseNoiseStep = $state(0.01);
	let smileyFace = $state(false);
	let strokeColor = $state('var(--liver-brown-500)');
	let strokeWidth = $state(2);

	let colorPickerOpen = $state(false);

	function toggleColorPicker() {
		colorPickerOpen = !colorPickerOpen;
	}

	const colors = [
		'var(--caroline-blue-500)',
		'var(--transit-yellow-500)',
		'var(--magic-mint-500)',
		'var(--blush-pink-500)',
		'var(--liver-brown-500)',
		'var(--eggshell-white-500)',
		'var(--lawn-green-500)',
		'var(--light-rose-500)'
	];

	function handleColorChange(color: string, name: string) {
		if (name === 'startColor') {
			startColor = color;
		} else if (name === 'stopColor') {
			stopColor = color;
		} else if (name === 'strokeColor') {
			strokeColor = color;
		}
	}

	let published = $state(false);
	let blobletClass = $state('');

	let interval: ReturnType<typeof setTimeout> | undefined = $state(undefined);

	function handlePublish() {
		blobletClass = 'fly-away';

		if (published) {
			clearTimeout(interval);
		}

		interval = setTimeout(() => {
			published = !published;
			blobletClass = '';
		}, 1000);
	}
</script>

<div class="create-your-own-bloblet col-span-2">
	<h2 class="text-2xl font-bold tracking-wide">create your own bloblet</h2>
	<div
		class="bloblet-container flex items-center gap-2 rounded-lg border-2 border-[var(--liver-brown-500)] bg-[var(--sandy-tan-200)] p-4 font-sans"
	>
		<div class="bloblet-container-inner flex w-[40%] flex-col items-center">
			{#if !published}
				<Bloblet3
					id={5}
					class={blobletClass}
					{startColor}
					{stopColor}
					{numPoints}
					{radius}
					{baseNoiseStep}
					{smileyFace}
					stroke={strokeColor}
					{strokeWidth}
				/>
			{:else}
				<div
					class="m-4 flex flex-col h-80 items-center justify-center rounded-lg border-2 border-[var(--liver-brown-500)] p-4 text-center"
				>
					<svg width="100" height="100" viewBox="0 0 100 100">
						<path
							d="M40,85 C60,90 75,80 85,65 C95,50 90,35 85,25 C80,15 65,10 50,15 C35,20 25,15 15,30 C5,45 10,60 20,75 C30,90 20,80 40,85"
							fill="#FFE4B5" 
							stroke="#000"
							stroke-width="2"
						/>
						<path
							d="M35,45 C35,42 32,40 30,42 C28,44 27,46 29,47 M65,45 C65,42 68,40 70,42 C72,44 73,46 71,47"
							fill="none"
							stroke="#000"
							stroke-width="2"
							stroke-linecap="round"
						/>
						<path
							d="M35,65 C40,68 45,70 50,68 C55,70 60,68 65,65"
							fill="none"
							stroke="#000"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
					your bloblet went up to the great bloblet farm in the sky.
                    <span class="p-2 text-[var(--liver-brown-600)]">Visit the Farm</span>
				</div>
			{/if}
			<Button class="w-48  uppercase" onclick={handlePublish}
				>{#if !published}Publish{:else}Restart{/if}</Button
			>
		</div>

		<div class="bloblet-controls">
			<div class="mt-4 flex flex-col gap-4">
				<ColorPicker
					label="Start Color"
					value={startColor}
					{colors}
					onColorChange={handleColorChange}
					name="startColor"
				/>

				<ColorPicker
					label="Stop Color"
					value={stopColor}
					{colors}
					onColorChange={handleColorChange}
					name="stopColor"
				/>

				<ColorPicker
					label="Stroke Color"
					value={strokeColor}
					{colors}
					onColorChange={handleColorChange}
					name="strokeColor"
				/>

				<div class="flex items-center gap-4">
					<label class="w-20 text-sm font-medium" for="strokeWidth">Stroke Width:</label>
					<input
						type="range"
						id="numPoints"
						min="0"
						max="36"
						class="h-2 w-48 cursor-pointer appearance-none rounded-lg bg-gray-200"
						bind:value={strokeWidth}
					/>
					<span class="ml-2 text-sm">{strokeWidth}</span>
				</div>

				<div class="flex items-center gap-4">
					<label class="w-20 text-sm font-medium" for="numPoints">Number of Points:</label>
					<input
						type="range"
						id="numPoints"
						min="3"
						max="36"
						class="h-2 w-48 cursor-pointer appearance-none rounded-lg bg-gray-200"
						bind:value={numPoints}
					/>
					<span class="ml-2 text-sm">{numPoints}</span>
				</div>

				<div class="flex items-center gap-4">
					<label class="w-20 text-sm font-medium" for="radius">Radius:</label>
					<input
						type="range"
						id="radius"
						min="40"
						max="120"
						class="h-2 w-48 cursor-pointer appearance-none rounded-lg bg-gray-200"
						bind:value={radius}
					/>
					<span class="ml-2 text-sm">
						{radius}
					</span>
				</div>

				<div class="flex items-center gap-4">
					<label class="w-20 text-sm font-medium" for="baseNoiseStep">Base Noise Step:</label>
					<input
						type="range"
						id="baseNoiseStep"
						min="0"
						max="1"
						step="0.01"
						class="h-2 w-48 cursor-pointer appearance-none rounded-lg bg-gray-200"
						bind:value={baseNoiseStep}
					/>
					<span class="ml-2 text-sm">
						{baseNoiseStep}
					</span>
				</div>

				<div class="flex items-center gap-4">
					<span class="w-20 text-sm font-medium">Addons:</span>

					<label for="smileyFace">
						<div
							class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-1 bg-gray-200"
							class:border-gray-500={smileyFace}
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<circle cx="9" cy="9" r="1.5" fill="black" />
								<circle cx="15" cy="9" r="1.5" fill="black" />
								<path
									d="M8 14C10 16 14 16 16 14"
									stroke="black"
									stroke-width="1.5"
									stroke-linecap="round"
									fill="none"
								/>
							</svg>
						</div>
					</label>
					<input class="hidden" type="checkbox" id="smileyFace" bind:checked={smileyFace} />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(.fly-away) {
		animation: fly-away 3s ease-in-out forwards;
	}

	@keyframes fly-away {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(-500%);
			opacity: 0;
		}
	}
</style>
