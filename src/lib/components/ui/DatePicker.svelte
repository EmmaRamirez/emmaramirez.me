<script lang="ts">
	interface DatePickerProps {
		/** Custom class names */
		class?: string;
		/** Label */
		label?: string;
		/** Selected date */
		value?: Date | null;
		/** Minimum selectable date */
		min?: Date;
		/** Maximum selectable date */
		max?: Date;
		/** Placeholder text */
		placeholder?: string;
		/** Error message */
		error?: string;
		/** Hint text */
		hint?: string;
		/** Callback when date changes */
		onchange?: (date: Date | null) => void;
	}

	let {
		class: className = '',
		label,
		value = $bindable(null),
		min,
		max,
		placeholder = 'Select date',
		error,
		hint,
		onchange
	}: DatePickerProps = $props();

	let isOpen = $state(false);
	let currentMonth = $state(value ?? new Date());

	const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const formattedValue = $derived(
		value
			? value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
			: ''
	);

	const daysInMonth = $derived.by(() => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const lastDate = new Date(year, month + 1, 0).getDate();

		const days: (Date | null)[] = [];

		for (let i = 0; i < firstDay; i++) {
			days.push(null);
		}

		for (let i = 1; i <= lastDate; i++) {
			days.push(new Date(year, month, i));
		}

		return days;
	});

	function prevMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
	}

	function nextMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
	}

	function selectDate(date: Date) {
		if (isDisabled(date)) return;
		value = date;
		isOpen = false;
		onchange?.(date);
	}

	function isDisabled(date: Date): boolean {
		if (min && date < new Date(min.getFullYear(), min.getMonth(), min.getDate())) return true;
		if (max && date > new Date(max.getFullYear(), max.getMonth(), max.getDate())) return true;
		return false;
	}

	function isSelected(date: Date): boolean {
		if (!value) return false;
		return date.toDateString() === value.toDateString();
	}

	function isToday(date: Date): boolean {
		return date.toDateString() === new Date().toDateString();
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.datepicker-container')) {
			isOpen = false;
		}
	}

	const generatedId = `datepicker-${Math.random().toString(36).slice(2, 9)}`;
</script>

<svelte:window onclick={handleClickOutside} />

<div class="datepicker-container relative {className}">
	{#if label}
		<label for={generatedId} class="mb-1.5 block text-sm font-medium text-[var(--liver-brown-700)]">
			{label}
		</label>
	{/if}

	<button
		type="button"
		id={generatedId}
		class="flex w-full items-center justify-between rounded-lg border-2 bg-[var(--eggshell-white-500)] px-3 py-2 text-left transition-colors
			{error
			? 'border-red-500'
			: 'border-[var(--liver-brown-500)] focus:border-[var(--caroline-blue-600)] focus:ring-2 focus:ring-[var(--caroline-blue-500)]'}
			{value ? 'text-[var(--liver-brown-800)]' : 'text-[var(--liver-brown-500)]'}"
		onclick={() => (isOpen = !isOpen)}
		aria-haspopup="dialog"
		aria-expanded={isOpen}
	>
		<span>{formattedValue || placeholder}</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="text-[var(--liver-brown-500)]"
		>
			<path d="M8 2v4" />
			<path d="M16 2v4" />
			<rect width="18" height="18" x="3" y="4" rx="2" />
			<path d="M3 10h18" />
		</svg>
	</button>

	{#if isOpen}
		<div
			class="absolute z-50 mt-1 rounded-xl border-2 border-[var(--liver-brown-500)] bg-[var(--sandy-tan-200)] p-4 shadow-xl"
			role="dialog"
			aria-modal="true"
			aria-label="Choose date"
		>
			<div class="mb-4 flex items-center justify-between">
				<button
					type="button"
					class="rounded p-1 transition-colors hover:bg-[var(--sandy-tan-400)]"
					onclick={prevMonth}
					aria-label="Previous month"
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
				<span class="font-semibold text-[var(--liver-brown-800)]">
					{months[currentMonth.getMonth()]}
					{currentMonth.getFullYear()}
				</span>
				<button
					type="button"
					class="rounded p-1 transition-colors hover:bg-[var(--sandy-tan-400)]"
					onclick={nextMonth}
					aria-label="Next month"
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
			</div>

			<div class="mb-2 grid grid-cols-7 gap-1">
				{#each weekDays as day}
					<div class="py-1 text-center text-xs font-medium text-[var(--liver-brown-600)]">
						{day}
					</div>
				{/each}
			</div>

			<div class="grid grid-cols-7 gap-1">
				{#each daysInMonth as day}
					{#if day}
						<button
							type="button"
							class="h-8 w-8 rounded-full text-sm transition-colors
								{isSelected(day) ? 'bg-[var(--caroline-blue-700)] text-white' : ''}
								{isToday(day) && !isSelected(day) ? 'border-2 border-[var(--caroline-blue-500)]' : ''}
								{isDisabled(day) ? 'cursor-not-allowed opacity-30' : 'hover:bg-[var(--sandy-tan-400)]'}
								{!isSelected(day) ? 'text-[var(--liver-brown-800)]' : ''}"
							disabled={isDisabled(day)}
							onclick={() => selectDate(day)}
						>
							{day.getDate()}
						</button>
					{:else}
						<div class="h-8 w-8"></div>
					{/if}
				{/each}
			</div>

			<button
				type="button"
				class="mt-3 w-full rounded py-1.5 text-sm font-medium text-[var(--caroline-blue-700)] transition-colors hover:bg-[var(--sandy-tan-400)]"
				onclick={() => selectDate(new Date())}
			>
				Today
			</button>
		</div>
	{/if}

	{#if error}
		<p class="mt-1.5 text-sm text-red-600" role="alert">{error}</p>
	{:else if hint}
		<p class="mt-1.5 text-sm text-[var(--liver-brown-600)]">{hint}</p>
	{/if}
</div>
