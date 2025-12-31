<script lang="ts">
	interface CommitBlockProps {
		title: string;
		date: string;
		hash: string;
		class: string;
	}
	let { title, date, hash, class: className }: CommitBlockProps = $props();
</script>

<div
	class="commit-block h-22 cursor-pointer rounded-lg border border-[var(--liver-brown-500)] bg-[var(--lawn-green-500)] font-sans transition-all duration-300 hover:scale-105 hover:bg-[var(--lawn-green-600)] {className}"
>
	<div class="flex items-center justify-between border-b border-[var(--lawn-green-900)] p-2 pb-2">
		<div class="commit-block-text">{title}</div>
		<div class="commit-block-hash text-s rounded-lg bg-[var(--lawn-green-600)] px-2 font-mono">
			{hash}
		</div>
	</div>
	<div class="commit-block-date p-2">{date}</div>
</div>
