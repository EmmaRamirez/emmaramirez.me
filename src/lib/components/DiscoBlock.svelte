<script lang="ts">
	import { onMount } from 'svelte';
	import ImageBlock from './ImageBlock.svelte';

	interface DiscoBlockProps {
		image: string;
		alt: string;
		caption: string;
		class: string;
	}

	let { image, alt, caption, class: className }: DiscoBlockProps = $props();

	let animationId = $state(0);

	let canvas: HTMLCanvasElement | null = $state(null);
	let ctx: CanvasRenderingContext2D | null = $state(null);
	let canvasBounds: DOMRect | null = $state(null);
	let discoSquares = $state(36);
	let discoSquareSize = 10;

	let isHovering = $state(false);
	let cursorX = $state(0);
	let cursorY = $state(0);
	let container: HTMLDivElement | null = $state(null);

	onMount(() => {
		canvas = document.getElementById('disco-canvas') as HTMLCanvasElement;
		ctx = canvas.getContext('2d');
		canvasBounds = canvas.getBoundingClientRect();
		const imageBlock = document.getElementById('disco-image');
		const imageBlockBounds = imageBlock?.getBoundingClientRect();
		console.log('imageBlockBounds', imageBlockBounds);
		canvas.width = imageBlockBounds?.width ?? 0;
		canvas.height = imageBlockBounds?.height ?? 0;
		discoSquares = Math.floor((imageBlockBounds?.width ?? 0) / discoSquareSize) + 1;
		console.log('discoSquares', discoSquares);
	});

	function moveDisco(event: MouseEvent) {
		isHovering = true;

		if (container) {
			const bounds = container.getBoundingClientRect();
			cursorX = event.clientX - bounds.left;
			cursorY = event.clientY - bounds.top;
		}

		animationId = requestAnimationFrame(() => {
			if (!ctx || !canvas) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			discoEffect({ clientX: event.clientX, clientY: event.clientY });
		});
	}

	function discoEffect({ clientX, clientY }: { clientX: number; clientY: number }) {
		if (!ctx || !canvasBounds) return;
		console.log('canvasBounds', canvasBounds);
		console.log(clientX - canvasBounds.left, clientY - canvasBounds.top);
		let rands = [];

		for (let i = 0; i < discoSquares; i++) {
			for (let j = 0; j < discoSquares; j++) {
				const x = clientX - canvasBounds.left;
				const y = clientY - canvasBounds.top;
				const discoX = j * discoSquareSize;
				const discoY = i * discoSquareSize;
				const noiseValue = Math.random() * 0.05;

				const absoluteDistanceX = Math.abs(discoX - x);
				const absoluteDistanceY = Math.abs(discoY - y);
				const distanceFromCenter = Math.sqrt(
					absoluteDistanceX * absoluteDistanceX + absoluteDistanceY * absoluteDistanceY
				);
				const rand = 1 - distanceFromCenter / (discoSquares * discoSquareSize) + noiseValue;

				rands.push(rand);

				ctx.beginPath();
				ctx.fillStyle = `rgba(${255 - rand * 10}, ${255 - rand * 10}, ${255 - rand * 10}, ${rand})`;
				ctx.fillRect(j * discoSquareSize, i * discoSquareSize, discoSquareSize, discoSquareSize);
			}
		}

		console.log(rands);
	}

	function stopDisco() {
		if (!ctx || !canvas) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		cancelAnimationFrame(animationId);
		isHovering = false;
	}
</script>

<div
	role="presentation"
	class="relative"
	bind:this={container}
	onmousemove={moveDisco}
	onmouseleave={stopDisco}
>
	<ImageBlock {image} {alt} {caption} class={className} imageId="disco-image">
		<canvas class="absolute top-0 left-0 pointer-events-none" id="disco-canvas"></canvas>

		{#if isHovering}
			<div
				class="disco-cursor pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
				style={`left:${cursorX}px;top:${cursorY}px;`}
			></div>
		{/if}
	</ImageBlock>
</div>


<style>
	@keyframes disco-glint {
		0%,
		100% {
			filter: brightness(1) hue-rotate(0deg);
		}

		50% {
			filter: brightness(1.3) hue-rotate(15deg);
		}
	}

	.disco-cursor {
		width: 40px;
		height: 40px;
		box-shadow: 0 0 25px rgba(255, 255, 255, 0.9);

		background:
			/* highlight */ radial-gradient(circle at 30% 20%, #ffffff 0, #ffffff 25%, rgba(255, 255, 255, 0) 45%),
			/* bottom shadow */ radial-gradient(circle at 50% 80%, rgba(0, 0, 0, 0.5) 0, rgba(0, 0, 0, 0) 60%),
			/* vertical tiles */ linear-gradient(90deg, rgba(255, 255, 255, 0.18) 1px, transparent 1px),
			/* horizontal tiles */ linear-gradient(180deg, rgba(255, 255, 255, 0.18) 1px, transparent 1px),
			/* base sphere */ radial-gradient(circle, #d7e0ff 0, #8f96ff 40%, #3c3f7a 70%, #0a0b1d 100%);

		background-size:
			100% 100%,
			100% 100%,
			6px 6px,
			6px 6px,
			100% 100%;

		background-repeat:
			no-repeat,
			no-repeat,
			repeat,
			repeat,
			no-repeat;

		animation: disco-glint 1.8s ease-in-out infinite;
	}
</style>
