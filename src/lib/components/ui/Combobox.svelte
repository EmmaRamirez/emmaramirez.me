<script lang="ts">
	type ComboboxOption = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	interface ComboboxProps {
		/** Custom class names */
		class?: string;
		/** Label for the combobox */
		label?: string;
		/** Placeholder text */
		placeholder?: string;
		/** Available options */
		options: ComboboxOption[];
		/** Selected value */
		value?: string;
		/** Hint text */
		hint?: string;
		/** Error message */
		error?: string;
		/** Callback when value changes */
		onchange?: (value: string) => void;
	}

	let {
		class: className = '',
		label,
		placeholder = 'Search...',
		options,
		value = $bindable(''),
		hint,
		error,
		onchange
	}: ComboboxProps = $props();

	let query = $state('');
	let isOpen = $state(false);
	let highlightedIndex = $state(-1);
	let inputRef: HTMLInputElement | undefined = $state();

	const filteredOptions = $derived(
		options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()))
	);

	const selectedLabel = $derived(options.find((opt) => opt.value === value)?.label ?? '');

	function selectOption(option: ComboboxOption) {
		if (option.disabled) return;
		value = option.value;
		query = option.label;
		isOpen = false;
		onchange?.(option.value);
	}

	function handleInputFocus() {
		isOpen = true;
		query = '';
	}

	function handleInputBlur(e: FocusEvent) {
		setTimeout(() => {
			isOpen = false;
			query = selectedLabel;
		}, 150);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (!isOpen) {
				isOpen = true;
			} else {
				highlightedIndex = Math.min(highlightedIndex + 1, filteredOptions.length - 1);
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			highlightedIndex = Math.max(highlightedIndex - 1, 0);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
				selectOption(filteredOptions[highlightedIndex]);
			}
		} else if (e.key === 'Escape') {
			isOpen = false;
			query = selectedLabel;
		}
	}

	$effect(() => {
		if (!isOpen) {
			query = selectedLabel;
			highlightedIndex = -1;
		}
	});

	const generatedId = `combobox-${Math.random().toString(36).slice(2, 9)}`;
</script>

<div class="relative {className}">
	{#if label}
		<label for={generatedId} class="mb-1.5 block text-sm font-medium text-[var(--liver-brown-700)]">
			{label}
		</label>
	{/if}

	<div class="relative">
		<input
			bind:this={inputRef}
			id={generatedId}
			type="text"
			role="combobox"
			autocomplete="off"
			aria-autocomplete="list"
			aria-expanded={isOpen}
			aria-controls="{generatedId}-listbox"
			aria-activedescendant={highlightedIndex >= 0
				? `${generatedId}-option-${highlightedIndex}`
				: undefined}
			class="w-full rounded-lg border-2 bg-[var(--eggshell-white-500)] px-3 py-2 pr-10 text-[var(--liver-brown-800)] transition-colors duration-200 placeholder:text-[var(--liver-brown-500)] focus:ring-2 focus:ring-offset-1 focus:outline-none
				{error
				? 'border-red-500 focus:ring-red-400'
				: 'border-[var(--liver-brown-500)] focus:border-[var(--caroline-blue-600)] focus:ring-[var(--caroline-blue-500)]'}"
			{placeholder}
			bind:value={query}
			onfocus={handleInputFocus}
			onblur={handleInputBlur}
			onkeydown={handleKeydown}
			aria-invalid={error ? 'true' : undefined}
		/>

		<button
			type="button"
			class="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-[var(--liver-brown-500)] hover:text-[var(--liver-brown-700)]"
			onclick={() => {
				isOpen = !isOpen;
				inputRef?.focus();
			}}
			tabindex="-1"
			aria-label="Toggle options"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="transition-transform {isOpen ? 'rotate-180' : ''}"
			>
				<path d="m6 9 6 6 6-6" />
			</svg>
		</button>
	</div>

	{#if isOpen && filteredOptions.length > 0}
		<ul
			id="{generatedId}-listbox"
			role="listbox"
			class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border-2 border-[var(--liver-brown-500)] bg-[var(--sandy-tan-200)] shadow-lg"
		>
			{#each filteredOptions as option, i (option.value)}
				<li
					id="{generatedId}-option-{i}"
					role="option"
					aria-selected={value === option.value}
					class="cursor-pointer px-3 py-2 transition-colors
						{value === option.value ? 'bg-[var(--caroline-blue-100)] text-[var(--caroline-blue-800)]' : ''}
						{highlightedIndex === i ? 'bg-[var(--sandy-tan-400)]' : ''}
					{option.disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-[var(--sandy-tan-400)]'}"
					onclick={() => selectOption(option)}
					onkeydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							event.preventDefault();
							selectOption(option);
						}
					}}
					onmouseenter={() => (highlightedIndex = i)}
				>
					{option.label}
				</li>
			{/each}
		</ul>
	{:else if isOpen && query && filteredOptions.length === 0}
		<div
			class="absolute z-50 mt-1 w-full rounded-lg border-2 border-[var(--liver-brown-500)] bg-[var(--sandy-tan-200)] px-3 py-2 text-[var(--liver-brown-600)] shadow-lg"
		>
			No results found
		</div>
	{/if}

	{#if error}
		<p class="mt-1.5 text-sm text-red-600" role="alert">{error}</p>
	{:else if hint}
		<p class="mt-1.5 text-sm text-[var(--liver-brown-600)]">{hint}</p>
	{/if}
</div>
