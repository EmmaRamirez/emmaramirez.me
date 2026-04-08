<script lang="ts">
	type CommandItem = {
		id: string;
		label: string;
		description?: string;
		icon?: string;
		shortcut?: string;
		group?: string;
		disabled?: boolean;
	};

	interface CommandPaletteProps {
		/** Custom class names */
		class?: string;
		/** Whether palette is open */
		open?: boolean;
		/** Available commands */
		commands: CommandItem[];
		/** Placeholder text */
		placeholder?: string;
		/** Callback when command is selected */
		onselect?: (commandId: string) => void;
		/** Callback when palette closes */
		onclose?: () => void;
	}

	let {
		class: className = '',
		open = $bindable(false),
		commands,
		placeholder = 'Type a command or search...',
		onselect,
		onclose
	}: CommandPaletteProps = $props();

	let query = $state('');
	let highlightedIndex = $state(0);
	let inputRef: HTMLInputElement | undefined = $state();

	const filteredCommands = $derived(
		commands.filter(
			(cmd) =>
				!cmd.disabled &&
				(cmd.label.toLowerCase().includes(query.toLowerCase()) ||
					cmd.description?.toLowerCase().includes(query.toLowerCase()) ||
					cmd.group?.toLowerCase().includes(query.toLowerCase()))
		)
	);

	const groupedCommands = $derived.by(() => {
		const groups: Record<string, CommandItem[]> = {};
		for (const cmd of filteredCommands) {
			const group = cmd.group ?? 'Actions';
			if (!groups[group]) groups[group] = [];
			groups[group].push(cmd);
		}
		return groups;
	});

	function selectCommand(command: CommandItem) {
		onselect?.(command.id);
		close();
	}

	function close() {
		open = false;
		query = '';
		highlightedIndex = 0;
		onclose?.();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			highlightedIndex = Math.min(highlightedIndex + 1, filteredCommands.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			highlightedIndex = Math.max(highlightedIndex - 1, 0);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (filteredCommands[highlightedIndex]) {
				selectCommand(filteredCommands[highlightedIndex]);
			}
		} else if (e.key === 'Escape') {
			close();
		}
	}

	function handleGlobalKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			open = !open;
			if (open) {
				setTimeout(() => inputRef?.focus(), 0);
			}
		}
	}

	$effect(() => {
		if (open) {
			setTimeout(() => inputRef?.focus(), 0);
		}
	});
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
		onclick={close}
		role="presentation"
	></div>

	<div
		class="fixed top-[15%] left-1/2 z-50 w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border-2 border-[var(--liver-brown-500)] bg-[var(--sandy-tan-200)] shadow-2xl {className}"
		role="dialog"
		aria-modal="true"
		aria-label="Command palette"
	>
		<div class="flex items-center gap-3 border-b-2 border-[var(--liver-brown-500)] px-4 py-3">
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
				class="text-[var(--liver-brown-500)]"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.3-4.3" />
			</svg>
			<input
				bind:this={inputRef}
				type="text"
				class="flex-1 bg-transparent text-[var(--liver-brown-800)] placeholder:text-[var(--liver-brown-500)] focus:outline-none"
				{placeholder}
				bind:value={query}
				onkeydown={handleKeydown}
			/>
			<kbd
				class="hidden items-center gap-1 rounded bg-[var(--sandy-tan-400)] px-2 py-1 text-xs text-[var(--liver-brown-600)] sm:inline-flex"
			>
				Esc
			</kbd>
		</div>

		<div class="max-h-80 overflow-y-auto p-2">
			{#if filteredCommands.length === 0}
				<div class="px-4 py-8 text-center text-[var(--liver-brown-600)]">No commands found</div>
			{:else}
				{#each Object.entries(groupedCommands) as [group, items] (group)}
					<div class="mb-2">
						<div
							class="px-2 py-1 text-xs font-semibold tracking-wider text-[var(--liver-brown-600)] uppercase"
						>
							{group}
						</div>
						{#each items as command (command.id)}
							{@const globalIndex = filteredCommands.findIndex((c) => c.id === command.id)}
							<button
								type="button"
								class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors
									{globalIndex === highlightedIndex
									? 'bg-[var(--sandy-tan-400)]'
									: 'hover:bg-[var(--sandy-tan-300)]'}"
								onclick={() => selectCommand(command)}
								onmouseenter={() => (highlightedIndex = globalIndex)}
							>
								<div class="min-w-0 flex-1">
									<div class="truncate font-medium text-[var(--liver-brown-800)]">
										{command.label}
									</div>
									{#if command.description}
										<div class="truncate text-sm text-[var(--liver-brown-600)]">
											{command.description}
										</div>
									{/if}
								</div>
								{#if command.shortcut}
									<kbd
										class="shrink-0 rounded bg-[var(--sandy-tan-400)] px-2 py-1 text-xs text-[var(--liver-brown-600)]"
									>
										{command.shortcut}
									</kbd>
								{/if}
							</button>
						{/each}
					</div>
				{/each}
			{/if}
		</div>

		<div
			class="flex items-center justify-between border-t-2 border-[var(--liver-brown-500)] bg-[var(--sandy-tan-300)] px-4 py-2 text-xs text-[var(--liver-brown-600)]"
		>
			<div class="flex items-center gap-3">
				<span class="flex items-center gap-1">
					<kbd class="rounded bg-[var(--sandy-tan-400)] px-1.5 py-0.5">↑↓</kbd>
					to navigate
				</span>
				<span class="flex items-center gap-1">
					<kbd class="rounded bg-[var(--sandy-tan-400)] px-1.5 py-0.5">↵</kbd>
					to select
				</span>
			</div>
			<span class="flex items-center gap-1">
				<kbd class="rounded bg-[var(--sandy-tan-400)] px-1.5 py-0.5">⌘K</kbd>
				to toggle
			</span>
		</div>
	</div>
{/if}
