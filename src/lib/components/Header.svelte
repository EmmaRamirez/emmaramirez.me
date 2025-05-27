<script lang="ts">

	let { title, headerColor = 'var(--caroline-blue-600)' } = $props();

</script>

<header style="--header-color: {headerColor}" class="border-6 border-[var(--liver-brown-500)] text-center bg-[var(--header-color)] text-white p-4 max-w-screen-sm translate-y-[-3rem] flex justify-between transition-all duration-300">
	<span>{title}</span>
</header>