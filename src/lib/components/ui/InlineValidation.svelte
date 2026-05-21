<script lang="ts">
	type ValidationStatus = 'error' | 'warning' | 'success' | 'info';

	interface InlineValidationProps {
		/** Custom class names */
		class?: string;
		/** Validation status */
		status?: ValidationStatus;
		/** Message to display */
		message: string;
		/** Associated input ID for aria-describedby */
		for?: string;
	}

	let {
		class: className = '',
		status = 'error',
		message,
		for: forId
	}: InlineValidationProps = $props();

	const statusClasses: Record<ValidationStatus, { text: string; icon: string }> = {
		error: {
			text: 'text-red-600',
			icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
		},
		warning: {
			text: 'text-[var(--transit-yellow-700)]',
			icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
		},
		success: {
			text: 'text-[var(--lawn-green-700)]',
			icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		info: {
			text: 'text-[var(--caroline-blue-700)]',
			icon: 'm11.25 11.25.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
		}
	};
</script>

<div
	id={forId ? `${forId}-validation` : undefined}
	class="mt-1.5 flex items-start gap-1.5 text-sm {statusClasses[status].text} {className}"
	role={status === 'error' ? 'alert' : 'status'}
	aria-live="polite"
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
		class="mt-0.5 shrink-0"
		aria-hidden="true"
	>
		<path d={statusClasses[status].icon} />
	</svg>
	<span>{message}</span>
</div>
