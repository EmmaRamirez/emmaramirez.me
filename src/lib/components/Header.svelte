<script lang="ts">

	let { title, headerColor = 'var(--caroline-blue-600)' } = $props();

</script>

<header style="--header-color: {headerColor}" class="translate-y-[-3.5rem] flex justify-between transition-all duration-300">
	<a class="style-none text-center bg-[var(--header-color)] text-white p-4 max-w-screen-sm border-6 border-[var(--liver-brown-500)] text-center bg-[var(--header-color)] text-white p-4 max-w-screen-sm" href="/">
		<span class="">{title}</span>
	</a>

	<div class="cursor-pointer rounded-full h-12 w-12 bg-[var(--liver-brown-500)] hover:bg-[var(--liver-brown-600)] transition-colors duration-300 p-2 translate-y-[1rem]">
		<svg viewBox="0 0 100 100" class="w-8 h-8">
			<circle 
				cx="50" 
				cy="50" 
				r="20" 
				fill="none" 
				stroke="white" 
				stroke-width="4"
			/>
			{#each Array(12) as _, i}
				<line
					x1="50"
					y1="20"
					x2="50"
					y2="10"
					stroke="white"
					stroke-width="4"
					transform="rotate({i * 30} 50 50)"
				/>
			{/each}
		</svg>
	</div>
</header>

