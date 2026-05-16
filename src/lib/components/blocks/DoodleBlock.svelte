<script lang="ts">
	import { onDestroy } from 'svelte';

	type BasicColor = {
		name: string;
		value: string;
	};

	type DrawingTool = 'pencil' | 'eraser';

	type Point = {
		x: number;
		y: number;
	};

	type Props = {
		class?: string;
	};

	const colors: BasicColor[] = [
		{ name: 'black', value: '#000000' },
		{ name: 'silver', value: '#c0c0c0' },
		{ name: 'gray', value: '#808080' },
		{ name: 'white', value: '#ffffff' },
		{ name: 'maroon', value: '#800000' },
		{ name: 'red', value: '#ff0000' },
		{ name: 'purple', value: '#800080' },
		{ name: 'fuchsia', value: '#ff00ff' },
		{ name: 'green', value: '#008000' },
		{ name: 'lime', value: '#00ff00' },
		{ name: 'olive', value: '#808000' },
		{ name: 'yellow', value: '#ffff00' },
		{ name: 'navy', value: '#000080' },
		{ name: 'blue', value: '#0000ff' },
		{ name: 'teal', value: '#008080' },
		{ name: 'aqua', value: '#00ffff' }
	];

	let { class: className = '' }: Props = $props();
	let selectedColor = $state(colors[0].value);
	let selectedTool = $state<DrawingTool>('pencil');
	let hasDrawing = $state(false);
	let isPeeling = $state(false);
	let drawingCanvas: HTMLCanvasElement | undefined;
	let peelCompletionTimer: ReturnType<typeof globalThis.setTimeout> | undefined;

	function clearPeelCompletionTimer() {
		if (peelCompletionTimer === undefined) return;

		globalThis.clearTimeout(peelCompletionTimer);
		peelCompletionTimer = undefined;
	}

	function prefersReducedMotion() {
		return (
			typeof window !== 'undefined' &&
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}

	function getPixelRatio() {
		if (typeof window === 'undefined') return 1;

		return Math.min(window.devicePixelRatio || 1, 3);
	}

	function clearDrawingCanvas() {
		const canvas = drawingCanvas;
		if (!canvas) return;

		const context = canvas.getContext('2d');
		if (!context) return;

		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.restore();
		hasDrawing = false;
	}

	function finishSubmitArt() {
		isPeeling = false;
		clearDrawingCanvas();
		peelCompletionTimer = undefined;
	}

	function handleSubmitArt() {
		if (isPeeling) return;

		clearPeelCompletionTimer();
		isPeeling = true;

		peelCompletionTimer = globalThis.setTimeout(
			finishSubmitArt,
			prefersReducedMotion() ? 120 : 920
		);
	}

	onDestroy(() => {
		clearPeelCompletionTimer();
	});

	function setupDrawingPad(canvas: HTMLCanvasElement) {
		const context = canvas.getContext('2d');
		if (!context) return;
		const drawingContext = context;
		drawingCanvas = canvas;

		let activePointerId: number | null = null;
		let lastPoint: Point | null = null;
		let canvasWidth = 0;
		let canvasHeight = 0;
		let pixelRatio = 1;

		function getCanvasPoint(event: PointerEvent): Point {
			const bounds = canvas.getBoundingClientRect();

			return {
				x: event.clientX - bounds.left,
				y: event.clientY - bounds.top
			};
		}

		function configureContext() {
			drawingContext.lineCap = 'round';
			drawingContext.lineJoin = 'round';
			drawingContext.miterLimit = 2;
		}

		function resize() {
			const { width, height } = canvas.getBoundingClientRect();
			if (width <= 0 || height <= 0) return;

			const nextPixelRatio = getPixelRatio();
			const nextWidth = Math.round(width * nextPixelRatio);
			const nextHeight = Math.round(height * nextPixelRatio);
			if (nextWidth === canvasWidth && nextHeight === canvasHeight) return;

			const previousDrawing = document.createElement('canvas');
			previousDrawing.width = canvas.width;
			previousDrawing.height = canvas.height;
			const previousContext = previousDrawing.getContext('2d');
			if (previousContext && canvas.width > 0 && canvas.height > 0) {
				previousContext.drawImage(canvas, 0, 0);
			}

			canvasWidth = nextWidth;
			canvasHeight = nextHeight;
			pixelRatio = nextPixelRatio;
			canvas.width = canvasWidth;
			canvas.height = canvasHeight;
			drawingContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
			configureContext();

			if (previousDrawing.width > 0 && previousDrawing.height > 0) {
				drawingContext.drawImage(previousDrawing, 0, 0, width, height);
			}
		}

		function drawStroke(from: Point, to: Point) {
			hasDrawing = true;
			drawingContext.save();
			drawingContext.globalCompositeOperation =
				selectedTool === 'eraser' ? 'destination-out' : 'source-over';
			drawingContext.strokeStyle = selectedColor;
			drawingContext.lineWidth = selectedTool === 'eraser' ? 18 : 4;
			drawingContext.beginPath();
			drawingContext.moveTo(from.x, from.y);
			drawingContext.lineTo(to.x, to.y);
			drawingContext.stroke();
			drawingContext.restore();
			configureContext();
		}

		function drawDot(point: Point) {
			hasDrawing = true;
			drawingContext.save();
			drawingContext.globalCompositeOperation =
				selectedTool === 'eraser' ? 'destination-out' : 'source-over';
			drawingContext.fillStyle = selectedColor;
			drawingContext.beginPath();
			drawingContext.arc(point.x, point.y, selectedTool === 'eraser' ? 9 : 2, 0, Math.PI * 2);
			drawingContext.fill();
			drawingContext.restore();
			configureContext();
		}

		function handlePointerDown(event: PointerEvent) {
			event.preventDefault();
			canvas.setPointerCapture(event.pointerId);
			activePointerId = event.pointerId;
			lastPoint = getCanvasPoint(event);
			drawDot(lastPoint);
		}

		function handlePointerMove(event: PointerEvent) {
			if (activePointerId !== event.pointerId || !lastPoint) return;

			const nextPoint = getCanvasPoint(event);
			drawStroke(lastPoint, nextPoint);
			lastPoint = nextPoint;
		}

		function finishStroke(event: PointerEvent) {
			if (activePointerId !== event.pointerId) return;

			if (canvas.hasPointerCapture(event.pointerId)) {
				canvas.releasePointerCapture(event.pointerId);
			}
			activePointerId = null;
			lastPoint = null;
		}

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(canvas);
		resize();

		canvas.addEventListener('pointerdown', handlePointerDown);
		canvas.addEventListener('pointermove', handlePointerMove);
		canvas.addEventListener('pointerup', finishStroke);
		canvas.addEventListener('pointercancel', finishStroke);
		canvas.addEventListener('lostpointercapture', finishStroke);

		return () => {
			if (drawingCanvas === canvas) {
				drawingCanvas = undefined;
			}

			resizeObserver.disconnect();
			canvas.removeEventListener('pointerdown', handlePointerDown);
			canvas.removeEventListener('pointermove', handlePointerMove);
			canvas.removeEventListener('pointerup', finishStroke);
			canvas.removeEventListener('pointercancel', finishStroke);
			canvas.removeEventListener('lostpointercapture', finishStroke);
		};
	}
</script>

<div class={['doodle-block', className]}>
	<div class="doodle-block__header">
		{#if hasDrawing}
			<button
				type="button"
				class="doodle-block__submit"
				disabled={isPeeling}
				onclick={handleSubmitArt}
			>
				Submit My Art
			</button>
		{/if}

		<div class="doodle-block__tools" aria-label="Drawing tools">
			<button
				type="button"
				class={['doodle-block__tool', selectedTool === 'pencil' && 'doodle-block__tool--selected']}
				style:--pencil-color={selectedColor}
				aria-pressed={selectedTool === 'pencil'}
				aria-label="Use pencil tool"
				onclick={() => (selectedTool = 'pencil')}
			>
				<svg
					class="doodle-block__tool-icon doodle-block__pencil-icon"
					viewBox="0 0 24 24"
					aria-hidden="true"
					focusable="false"
				>
					<path
						class="doodle-block__pencil-stroke"
						d="M4 20l4.7-1.1L19.8 7.8a2 2 0 0 0 0-2.8l-.8-.8a2 2 0 0 0-2.8 0L5.1 15.3 4 20z"
					/>
					<path
						class="doodle-block__pencil-stroke"
						d="M14.8 5.6l3.6 3.6M5.1 15.3l3.6 3.6"
					/>
				</svg>
			</button>
			<button
				type="button"
				class={['doodle-block__tool', selectedTool === 'eraser' && 'doodle-block__tool--selected']}
				aria-pressed={selectedTool === 'eraser'}
				aria-label="Use eraser tool"
				onclick={() => (selectedTool = 'eraser')}
			>
				<svg class="doodle-block__tool-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path
						d="M4.7 14.3 12 7a2.2 2.2 0 0 1 3.1 0L20 11.9a2.2 2.2 0 0 1 0 3.1l-4.7 4.7H8.6l-3.9-3.9a1.1 1.1 0 0 1 0-1.5z"
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
					/>
					<path
						d="M9.4 9.6 16.4 16.6M8.6 19.7H20"
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
					/>
				</svg>
			</button>
		</div>
	</div>

	<div
		class={[
			'doodle-block__paper',
			isPeeling && 'doodle-block__paper--peeling'
		]}
	>
		<canvas
			{@attach setupDrawingPad}
			class="doodle-block__canvas"
			aria-label="Drawing canvas"
		>
			Drawing canvas
		</canvas>
	</div>

	<div class="doodle-block__palette" aria-label="Drawing colors">
		{#each colors as color (color.name)}
			<button
				type="button"
				class="doodle-block__swatch"
				style:--swatch-color={color.value}
				aria-label={`Select ${color.name}`}
				aria-pressed={selectedColor === color.value}
				title={color.name}
				onclick={() => {
					selectedColor = color.value;
					selectedTool = 'pencil';
				}}
			>
				<span class="doodle-block__swatch-label">{color.name}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.doodle-block {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		gap: 0.8rem;
		min-height: min(34rem, calc(140vw - 2rem));
		min-width: 0;
		overflow: hidden;
		border: 1px solid rgb(15 23 42 / 0.12);
		border-radius: 1.5rem;
		background:
			radial-gradient(circle at 18% 12%, rgb(255 255 255 / 0.94), transparent 9rem),
			linear-gradient(135deg, #ffffff, #fbfdff 58%, #f7fafc);
		color: #172033;
		padding: 0.9rem;
		box-shadow:
			inset 0 0 0 1px rgb(255 255 255 / 0.82),
			0 1rem 2rem rgb(15 23 42 / 0.07);
	}

	.doodle-block__header {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		justify-content: flex-start;
	}

	.doodle-block__tools {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		justify-content: flex-end;
		margin-left: auto;
	}

	.doodle-block__submit {
		border: 1px solid rgb(23 32 51 / 0.18);
		border-radius: 999px;
		background: rgb(255 255 255 / 0.9);
		color: #172033;
		cursor: pointer;
		font: inherit;
		font-family: 'Noto Sans', sans-serif;
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.02em;
		padding: 0.45rem 0.75rem;
		box-shadow: 0 0.25rem 0 rgb(15 23 42 / 0.08);
	}

	.doodle-block__submit:disabled {
		cursor: wait;
		opacity: 0.62;
	}

	.doodle-block__tool,
	.doodle-block__swatch {
		border: 1px solid rgb(15 23 42 / 0.14);
		background: rgb(255 255 255 / 0.86);
		color: inherit;
		cursor: pointer;
		font: inherit;
	}

	.doodle-block__tool {
		display: inline-grid;
		place-items: center;
		width: 2.15rem;
		height: 2.15rem;
		border-radius: 999px;
		padding: 0;
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.02em;
		box-shadow: 0 0.25rem 0 rgb(15 23 42 / 0.08);
	}

	.doodle-block__tool-icon {
		width: 1.15rem;
		height: 1.15rem;
	}

	.doodle-block__pencil-icon {
		color: var(--pencil-color, #000000);
	}

	.doodle-block__pencil-stroke {
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2.25
	}

	.doodle-block__tool--selected {
		border-color: #172033;
		background: rgb(15 23 42 / 0.04);
		color: #172033;
		box-shadow:
			inset 0 0 0 1px #172033,
			0 0.25rem 0 rgb(15 23 42 / 0.08);
	}

	.doodle-block__paper {
		position: relative;
		min-height: 12rem;
		overflow: hidden;
		transform-origin: 92% 8%;
		border: 1px solid rgb(15 23 42 / 0.14);
		border-radius: 1.05rem;
		background:
			linear-gradient(rgb(15 23 42 / 0.035) 1px, transparent 1px),
			linear-gradient(90deg, rgb(15 23 42 / 0.03) 1px, transparent 1px),
			#ffffff;
		background-size: 1.25rem 1.25rem;
		box-shadow:
			inset 0 0 0 1px rgb(255 255 255 / 0.9),
			inset 0 -0.8rem 2rem rgb(15 23 42 / 0.035);
	}

	.doodle-block__paper::after {
		content: '';
		position: absolute;
		inset: -8% -18% -8% auto;
		width: 38%;
		border-radius: 55% 0 0 55%;
		background:
			linear-gradient(90deg, rgb(255 255 255 / 0), rgb(255 255 255 / 0.9) 42%, rgb(207 216 228 / 0.82)),
			linear-gradient(180deg, rgb(255 255 255 / 0.75), rgb(143 155 177 / 0.24) 56%, rgb(15 23 42 / 0.18));
		box-shadow:
			-1.4rem 0 2.2rem rgb(15 23 42 / 0.16),
			inset 0.55rem 0 0.8rem rgb(255 255 255 / 0.75),
			inset -0.4rem 0 0.7rem rgb(15 23 42 / 0.12);
		opacity: 0;
		pointer-events: none;
		transform: translateX(58%) rotateY(-20deg) skewY(-4deg);
		transform-origin: right center;
	}

	.doodle-block__paper--peeling {
		pointer-events: none;
		animation: doodle-paper-peel 900ms cubic-bezier(0.18, 0.72, 0.18, 1) forwards;
		will-change: transform, opacity, filter;
	}

	.doodle-block__paper--peeling::after {
		animation: doodle-paper-curl 900ms cubic-bezier(0.18, 0.72, 0.18, 1) forwards;
		will-change: transform, opacity, filter;
	}

	.doodle-block__canvas {
		display: block;
		width: 100%;
		height: 100%;
		touch-action: none;
		cursor: crosshair;
	}

	.doodle-block__palette {
		display: grid;
		grid-template-columns: repeat(8, minmax(0, 1fr));
		gap: 0.35rem;
	}

	.doodle-block__swatch {
		position: relative;
		aspect-ratio: 1;
		min-height: 1.65rem;
		border-color: rgb(15 23 42 / 0.22);
		border-radius: 0.45rem;
		background: var(--swatch-color);
		box-shadow: none;
	}

	.doodle-block__swatch-label {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		clip-path: inset(50%);
	}

	@keyframes doodle-paper-peel {
		0% {
			opacity: 1;
			filter: drop-shadow(0 0 0 rgb(15 23 42 / 0));
			transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
		}

		32% {
			opacity: 1;
			filter: drop-shadow(-0.8rem 0.9rem 1.2rem rgb(15 23 42 / 0.12));
			transform: perspective(50rem) translate3d(0.45rem, -0.35rem, 0) rotateX(3deg)
				rotateY(-9deg) rotateZ(1deg) scale(0.995);
		}

		68% {
			opacity: 0.9;
			filter: drop-shadow(-1.2rem 1.4rem 1.7rem rgb(15 23 42 / 0.16));
			transform: perspective(50rem) translate3d(42%, -10%, 0) rotateX(4deg) rotateY(-18deg)
				rotateZ(5deg) scale(0.96);
		}

		100% {
			opacity: 0;
			filter: drop-shadow(-1rem 1.2rem 1.5rem rgb(15 23 42 / 0.08));
			transform: perspective(50rem) translate3d(115%, -22%, 0) rotateX(5deg) rotateY(-24deg)
				rotateZ(9deg) scale(0.92);
		}
	}

	@keyframes doodle-paper-curl {
		0% {
			opacity: 0;
			filter: blur(0);
			transform: translateX(58%) rotateY(-20deg) skewY(-4deg);
		}

		20% {
			opacity: 0.95;
			filter: blur(0);
			transform: translateX(24%) rotateY(-36deg) skewY(-6deg);
		}

		64% {
			opacity: 0.9;
			filter: blur(0.01rem);
			transform: translateX(-10%) rotateY(-48deg) skewY(-8deg) scaleX(1.16);
		}

		100% {
			opacity: 0;
			filter: blur(0.03rem);
			transform: translateX(-22%) rotateY(-56deg) skewY(-10deg) scaleX(1.24);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.doodle-block__paper--peeling {
			animation: doodle-paper-fade 120ms ease-out forwards;
		}

		.doodle-block__paper--peeling::after {
			animation: none;
		}

	}

	@keyframes doodle-paper-fade {
		to {
			opacity: 0;
		}
	}

	@media (min-width: 48rem) {
		.doodle-block {
			height: 100%;
			min-height: 100%;
		}

		.doodle-block__paper {
			min-height: 0;
		}
	}
</style>
