<script lang="ts">
	interface SearchFieldProps extends Omit<
		svelteHTML.HTMLAttributes<HTMLInputElement>,
		'type' | 'value'
	> {
		/** Custom class names */
		class?: string;
		/** Current search value */
		value?: string;
		/** Placeholder text */
		placeholder?: string;
		/** Show loading spinner */
		loading?: boolean;
		/** Callback when search is submitted */
		onsearch?: (value: string) => void;
		/** Input ID */
		id?: string;
	}

	let {
		class: className = '',
		value = $bindable(''),
		placeholder = 'Search...',
		loading = false,
		onsearch,
		id,
		...inputProps
	}: SearchFieldProps = $props();

	const generatedId = `search-${Math.random().toString(36).slice(2, 9)}`;
	const inputId = $derived(id ?? generatedId);

	function handleSubmit(e: Event) {
		e.preventDefault();
		onsearch?.(value);
	}

	function handleClear() {
		value = '';
		onsearch?.('');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			onsearch?.(value);
		}
	}
</script>

<div class="relative {className}">
	<div
		class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--liver-brown-500)]"
	>
		{#if loading}
			<div
				class="h-4 w-4 animate-spin rounded-full border-2 border-[var(--caroline-blue-600)] border-t-transparent"
			></div>
		{:else}
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
			>
				<circle cx="11" cy="11" r="8"></circle>
				<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
			</svg>
		{/if}
	</div>

	<input
		type="search"
		id={inputId}
		class="w-full rounded-lg border-2 border-[var(--liver-brown-500)] bg-[var(--eggshell-white-500)] py-2 pr-10 pl-10 text-[var(--liver-brown-800)] transition-colors duration-200 placeholder:text-[var(--liver-brown-500)] focus:border-[var(--caroline-blue-600)] focus:ring-2 focus:ring-[var(--caroline-blue-500)] focus:outline-none"
		{placeholder}
		bind:value
		onkeydown={handleKeydown}
		{...inputProps}
	/>

	{#if value}
		<button
			type="button"
			class="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-[var(--liver-brown-500)] transition-colors hover:bg-[var(--sandy-tan-400)] hover:text-[var(--liver-brown-700)]"
			onclick={handleClear}
			aria-label="Clear search"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
	{/if}
</div>
