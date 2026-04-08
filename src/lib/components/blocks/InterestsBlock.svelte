<script lang="ts">
	let interests = [
		{
			name: 'developer tooling',
			description: 'I love building tools for developers to use.'
		},
		{
			name: 'artificial intelligence',
			description: 'I love using generative ai to create things.'
		},
		{
			name: 'networking',
			description: 'software defined networking, aerospace satellite communications'
		},
		{
			name: 'telehealth',
			description:
				'democratizing healthcare, telemedicine, and legislative repsponses to telehealth'
		},
		{
			name: 'open source',
			description: 'I love open source software and the community that surrounds it.'
		},
		{
			name: 'FIRE finance',
			description: 'I love the idea of financial independence and early retirement.'
		}
	];
</script>

<div
	class="hobbies relative col-span-2 mb-4 h-48 self-center rounded-lg border-4 border-[var(--liver-brown-500)] p-4"
>
	<h3 class="pb-4 text-right text-xl font-bold tracking-wide text-[var(--eggshell-white-500)]">
		my interests
	</h3>

	<div class="hobbies-list grid grid-cols-3 gap-4">
		{#each interests as interest}
			<span
				class="hobbies-item bg-[var(--eggshell-white-500)] p-2 font-sans text-xl font-bold text-[var(--liver-brown-500)]"
				>{interest.name}</span
			>
		{/each}
	</div>
</div>

<style>
	.hobbies::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--liver-brown-500);
		z-index: -1;
	}
</style>
