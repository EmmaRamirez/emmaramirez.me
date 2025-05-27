<script lang="ts">
	import { fade } from 'svelte/transition';

	let { label, value, colors, onColorChange, name } = $props();

	let color = $state(value);
	let colorPickerOpen = $state(false);

	function toggleColorPicker() {
		colorPickerOpen = !colorPickerOpen;
	}

	function handleColorChange(chosenColor: string, name: string) {
		color = chosenColor;
		onColorChange(chosenColor, name);
	}
</script>

<div class="flex items-center gap-4">
	<label class="w-20 text-sm font-medium" for={name}>{label}</label>
	<div class="flex items-center gap-2">
		<div
			onclick={toggleColorPicker}
			class="h-4 w-4 cursor-pointer rounded-lg"
			style="background-color: {color}"
		></div>
		<input
			type="text"
			id={name}
			class="rounded border bg-white px-3 py-1 text-sm"
			placeholder="var(--color-name)"
			bind:value={color}
		/>
	</div>
</div>

{#if colorPickerOpen}
	<div class="color-picker rounded-lg border bg-white p-2" transition:fade={{ duration: 250 }}>
		<div class="color-picker-list flex flex-wrap gap-2">
			{#each colors as color}
				<div
					class="color-picker-item h-8 w-8 rounded-lg cursor-pointer"
					style="background-color: {color}"
					onclick={() => handleColorChange(color, name)}
				></div>
			{/each}
		</div>
	</div>
{/if}
