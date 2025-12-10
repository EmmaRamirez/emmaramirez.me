<script lang="ts">
	type FileInputAccept = 'image/*' | 'video/*' | 'audio/*' | '.pdf' | '.doc,.docx' | string;

	interface FileInputProps {
		/** Custom class names */
		class?: string;
		/** Label text */
		label?: string;
		/** Hint text */
		hint?: string;
		/** Error message */
		error?: string;
		/** Accepted file types */
		accept?: FileInputAccept;
		/** Allow multiple files */
		multiple?: boolean;
		/** Selected files */
		files?: FileList | null;
		/** Callback when files change */
		onchange?: (files: FileList | null) => void;
		/** Input ID */
		id?: string;
		/** Disabled state */
		disabled?: boolean;
	}

	let {
		class: className = '',
		label,
		hint,
		error,
		accept,
		multiple = false,
		files = $bindable(null),
		onchange,
		id,
		disabled = false
	}: FileInputProps = $props();

	const generatedId = `file-${Math.random().toString(36).slice(2, 9)}`;
	const inputId = $derived(id ?? generatedId);

	let dragOver = $state(false);
	let inputEl: HTMLInputElement;

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		files = target.files;
		onchange?.(files);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		if (disabled) return;
		
		if (e.dataTransfer?.files) {
			files = e.dataTransfer.files;
			onchange?.(files);
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (!disabled) {
			dragOver = true;
		}
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function handleClick() {
		inputEl?.click();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			inputEl?.click();
		}
	}

	const fileNames = $derived(
		files ? Array.from(files).map(f => f.name).join(', ') : ''
	);
</script>

<div class="flex flex-col gap-1.5 {className}">
	{#if label}
		<label for={inputId} class="text-sm font-medium text-[var(--liver-brown-700)]">
			{label}
		</label>
	{/if}

	<div
		class="relative border-2 border-dashed rounded-lg transition-colors duration-200 {error ? 'border-red-500' : dragOver ? 'border-[var(--caroline-blue-500)] bg-[var(--caroline-blue-100)]' : 'border-[var(--liver-brown-500)] bg-[var(--eggshell-white-500)]'} {disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--caroline-blue-500)]'}"
		role="button"
		tabindex={disabled ? -1 : 0}
		ondrop={handleDrop}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		onclick={handleClick}
		onkeydown={handleKeydown}
	>
		<input
			bind:this={inputEl}
			type="file"
			id={inputId}
			class="sr-only"
			{accept}
			{multiple}
			{disabled}
			onchange={handleChange}
		/>

		<div class="flex flex-col items-center justify-center py-8 px-4 text-center">
			<svg class="mb-3 text-[var(--liver-brown-500)]" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
				<polyline points="17 8 12 3 7 8"></polyline>
				<line x1="12" y1="3" x2="12" y2="15"></line>
			</svg>
			
			{#if fileNames}
				<p class="text-sm font-medium text-[var(--liver-brown-800)]">
					{fileNames}
				</p>
				<p class="text-xs text-[var(--liver-brown-600)] mt-1">
					Click or drag to replace
				</p>
			{:else}
				<p class="text-sm font-medium text-[var(--liver-brown-800)]">
					<span class="text-[var(--caroline-blue-700)] underline">Click to upload</span> or drag and drop
				</p>
				{#if hint}
					<p class="text-xs text-[var(--liver-brown-600)] mt-1">
						{hint}
					</p>
				{/if}
			{/if}
		</div>
	</div>

	{#if error}
		<p class="text-sm text-red-600" role="alert">{error}</p>
	{/if}
</div>

