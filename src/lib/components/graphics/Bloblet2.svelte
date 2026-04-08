<script lang="ts">
	import { onMount } from 'svelte';

	interface BlobletProps {
		class?: string;
		fill?: string;
	}

	let { class: className, fill = 'var(--transit-yellow-500)' }: BlobletProps = $props();

	let path = $state<string>(
		'M384 160C480.5 29.5003 362.893 -35.6147 307 21.0001C251.107 77.6149 -105.864 177.507 31.5682 280.004C169 382.5 287.5 290.5 384 160Z'
	);

	let paths = $state<string[]>([]);

	function generatePaths(pathArray: string[]) {
		for (let point in pathArray) {
			if (!Number.isNaN(Number(point))) {
				let newPoint = point + (Math.random() * 20 - 5);
				pathArray.splice(pathArray.indexOf(point), 1, newPoint);
			}
		}

		return pathArray.join(' ');
	}

	function onMouseOver() {
		let ticks = 0;
		console.log('mouse over');

		paths = path.split(' ');

		setInterval(() => {
			ticks++;
			if (ticks > 240) {
				path = generatePaths(path.split(' '));
			}
		}, 1000 / 6);
	}

	onMount(() => {
		onMouseOver();
	});
</script>

<svg
	class={className}
	width="421"
	height="324"
	viewBox="0 0 421 324"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path d={path} {fill} />
</svg>
