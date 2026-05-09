<script lang="ts" module>
	import { writable } from 'svelte/store';

	export type ToastType = 'info' | 'success' | 'warning' | 'error';

	export type ToastItem = {
		id: string;
		type: ToastType;
		message: string;
		title?: string;
		duration?: number;
	};

	function createToastStore() {
		const { subscribe, update } = writable<ToastItem[]>([]);

		return {
			subscribe,
			add: (toast: Omit<ToastItem, 'id'>) => {
				const id = Math.random().toString(36).slice(2, 9);
				const newToast: ToastItem = { id, ...toast };
				update((toasts) => [...toasts, newToast]);

				if (toast.duration !== 0) {
					setTimeout(() => {
						update((toasts) => toasts.filter((t) => t.id !== id));
					}, toast.duration ?? 5000);
				}

				return id;
			},
			remove: (id: string) => {
				update((toasts) => toasts.filter((t) => t.id !== id));
			},
			clear: () => {
				update(() => []);
			}
		};
	}

	export const toasts = createToastStore();
</script>

<script lang="ts">
	interface ToastContainerProps {
		/** Position of toast container */
		position?:
			| 'top-right'
			| 'top-left'
			| 'bottom-right'
			| 'bottom-left'
			| 'top-center'
			| 'bottom-center';
		/** Custom class names */
		class?: string;
	}

	let { position = 'bottom-right', class: className = '' }: ToastContainerProps = $props();

	const positionClasses: Record<string, string> = {
		'top-right': 'top-4 right-4',
		'top-left': 'top-4 left-4',
		'bottom-right': 'bottom-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'top-center': 'top-4 left-1/2 -translate-x-1/2',
		'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
	};

	const typeClasses: Record<ToastType, { bg: string; icon: string; border: string }> = {
		info: { bg: 'bg-blue-50', icon: 'text-blue-500', border: 'border-blue-400' },
		success: { bg: 'bg-green-50', icon: 'text-green-500', border: 'border-green-400' },
		warning: {
			bg: 'bg-[var(--transit-yellow-100)]',
			icon: 'text-[var(--transit-yellow-700)]',
			border: 'border-[var(--transit-yellow-600)]'
		},
		error: { bg: 'bg-red-50', icon: 'text-red-500', border: 'border-red-400' }
	};

	const icons: Record<ToastType, string> = {
		info: 'M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z',
		success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		warning:
			'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
		error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
	};
</script>

<div
	class="pointer-events-none fixed z-[100] flex w-full max-w-sm flex-col gap-2 {positionClasses[
		position
	]} {className}"
>
	{#each $toasts as toast (toast.id)}
		<div
			class="animate-toast-in pointer-events-auto flex gap-3 rounded-lg border-l-4 p-4 shadow-lg {typeClasses[
				toast.type
			].bg} {typeClasses[toast.type].border}"
			role="alert"
		>
			<div class="shrink-0 {typeClasses[toast.type].icon}">
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
					<path d={icons[toast.type]}></path>
				</svg>
			</div>

			<div class="min-w-0 flex-1">
				{#if toast.title}
					<p class="text-sm font-semibold text-[var(--liver-brown-900)]">{toast.title}</p>
				{/if}
				<p class="text-sm text-[var(--liver-brown-700)]">{toast.message}</p>
			</div>

			<button
				type="button"
				class="shrink-0 rounded-full p-1 transition-colors hover:bg-black/10"
				onclick={() => toasts.remove(toast.id)}
				aria-label="Dismiss"
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
		</div>
	{/each}
</div>

<style>
	@keyframes toast-in {
		from {
			opacity: 0;
			transform: translateY(0.625rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-toast-in {
		animation: toast-in 0.2s ease-out;
	}
</style>
