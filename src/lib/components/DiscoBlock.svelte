<script lang="ts">
	import { onMount } from 'svelte';
	import ImageBlock from './ImageBlock.svelte';

	interface DiscoBlockProps {
		image: string;
		alt: string;
		caption: string;
		class: string;
	}

	interface LightBeam {
		baseAngle: number;
		distance: number;
		size: number;
		speed: number;
		brightness: number;
		hue: number;
		orbitRadius: number;
		phaseOffset: number;
	}

	interface CursorSample {
		x: number;
		y: number;
		time: number;
	}

	let { image, alt, caption, class: className }: DiscoBlockProps = $props();

	let animationId = $state(0);
	let canvas: HTMLCanvasElement | null = $state(null);
	let ctx: CanvasRenderingContext2D | null = $state(null);

	let isHovering = $state(false);
	let cursorX = $state(0);
	let cursorY = $state(0);
	let container: HTMLDivElement | null = $state(null);
	let imageBlock: HTMLElement | null = $state(null);
	let canvasWidth = $state(0);
	let canvasHeight = $state(0);

	let lightBeams: LightBeam[] = $state([]);
	let time = $state(0);

	const SAMPLE_HISTORY_SIZE = 12;
	let cursorHistory: CursorSample[] = $state([]);
	let volatility = $state(0);
	let targetVolatility = $state(0);

	const MIN_BEAMS = 60;
	const MAX_BEAMS = 800;
	const VOLATILITY_SMOOTHING = 0.15;
	const VOLATILITY_DECAY = 0.92;

	function calculateVolatility(): number {
		if (cursorHistory.length < 3) return 0;

		let totalSpeed = 0;
		let directionChanges = 0;
		let prevDx = 0;
		let prevDy = 0;

		for (let i = 1; i < cursorHistory.length; i++) {
			const prev = cursorHistory[i - 1];
			const curr = cursorHistory[i];
			const dt = Math.max(curr.time - prev.time, 1);
			
			const dx = curr.x - prev.x;
			const dy = curr.y - prev.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const speed = distance / dt;
			
			totalSpeed += speed;

			if (i > 1) {
				const dotProduct = dx * prevDx + dy * prevDy;
				const magPrev = Math.sqrt(prevDx * prevDx + prevDy * prevDy);
				const magCurr = Math.sqrt(dx * dx + dy * dy);
				
				if (magPrev > 0.5 && magCurr > 0.5) {
					const cosAngle = dotProduct / (magPrev * magCurr);
					directionChanges += (1 - cosAngle) / 2;
				}
			}

			prevDx = dx;
			prevDy = dy;
		}

		const avgSpeed = totalSpeed / (cursorHistory.length - 1);
		const avgDirectionChange = directionChanges / Math.max(cursorHistory.length - 2, 1);

		const speedFactor = Math.min(avgSpeed / 3, 1);
		const directionFactor = avgDirectionChange;

		return Math.min(speedFactor * 0.6 + directionFactor * 0.4, 1);
	}

	function updateCursorTracking(x: number, y: number) {
		const now = performance.now();
		
		cursorHistory.push({ x, y, time: now });
		
		if (cursorHistory.length > SAMPLE_HISTORY_SIZE) {
			cursorHistory = cursorHistory.slice(-SAMPLE_HISTORY_SIZE);
		}

		targetVolatility = calculateVolatility();
	}

	function updateVolatility() {
		if (targetVolatility > volatility) {
			volatility += (targetVolatility - volatility) * VOLATILITY_SMOOTHING;
		} else {
			volatility *= VOLATILITY_DECAY;
			if (volatility < 0.01) volatility = 0;
		}
	}

	function getVisibleBeamCount(): number {
		return Math.floor(MIN_BEAMS + (MAX_BEAMS - MIN_BEAMS) * volatility);
	}

	function generateBeams(count: number = 200): LightBeam[] {
		const beams: LightBeam[] = [];
		
		const rings = 10;
		const beamsPerRing = Math.floor(count / rings);
		
		for (let ring = 0; ring < rings; ring++) {
			const ringDistance = 20 + ring * 28;
			const ringSpeed = 0.2 + ring * 0.08;
			
			for (let i = 0; i < beamsPerRing; i++) {
				const angleSpread = (Math.PI * 2) / beamsPerRing;
				beams.push({
					baseAngle: i * angleSpread + (ring * 0.3),
					distance: ringDistance + (Math.random() - 0.5) * 20,
					size: 5 + Math.random() * 10,
					speed: ringSpeed + (Math.random() - 0.5) * 0.12,
					brightness: 0.4 + Math.random() * 0.6,
					hue: Math.random() * 80 - 40,
					orbitRadius: 2 + Math.random() * 12,
					phaseOffset: Math.random() * Math.PI * 2,
				});
			}
		}
		
		return beams;
	}

	function drawDiscoBeams() {
		if (!ctx || !canvas) return;
		
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		
		const pixelSize = 10;
		const visibleCount = getVisibleBeamCount();
		
		for (let i = 0; i < Math.min(visibleCount, lightBeams.length); i++) {
			const beam = lightBeams[i];
			
			const rotatedAngle = beam.baseAngle + time * beam.speed;
			
			const volatilityBoost = 1 + volatility * 2;
			const wobbleX = Math.cos(time * 2 + beam.phaseOffset) * beam.orbitRadius * volatilityBoost;
			const wobbleY = Math.sin(time * 3 + beam.phaseOffset) * beam.orbitRadius * 0.5 * volatilityBoost;
			
			const x = cursorX + Math.cos(rotatedAngle) * beam.distance + wobbleX;
			const y = cursorY + Math.sin(rotatedAngle) * beam.distance + wobbleY;
			
			const snappedX = Math.floor(x / pixelSize) * pixelSize;
			const snappedY = Math.floor(y / pixelSize) * pixelSize;
			
			if (snappedX < -pixelSize || snappedX > canvasWidth + pixelSize || 
				snappedY < -pixelSize || snappedY > canvasHeight + pixelSize) {
				continue;
			}
			
			const pulseIntensity = 0.3 + volatility * 0.3;
			const angleBrightness = Math.sin(rotatedAngle * 3 + time) * pulseIntensity + (1 - pulseIntensity / 2);
			const finalBrightness = beam.brightness * angleBrightness;
			
			const hue = 45 + beam.hue * (1 + volatility);
			const saturation = 15 + Math.abs(beam.hue) * 0.5 + volatility * 20;
			const lightness = 90 + finalBrightness * 10;
			
			ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${Math.min(lightness, 100)}%, ${finalBrightness})`;
			ctx.fillRect(snappedX, snappedY, pixelSize, pixelSize);
		}
	}

	function animate(timestamp: number) {
		time = timestamp * 0.001;
		updateVolatility();
		drawDiscoBeams();
		
		if (isHovering) {
			animationId = requestAnimationFrame(animate);
		}
	}

	function startDisco(event: MouseEvent) {
		if (!isHovering) {
			isHovering = true;
			lightBeams = generateBeams(MAX_BEAMS);
			cursorHistory = [];
			volatility = 0;
			targetVolatility = 0;
			animationId = requestAnimationFrame(animate);
		}
		
		if (container) {
			const bounds = container.getBoundingClientRect();
			const newX = event.clientX - bounds.left;
			const newY = event.clientY - bounds.top;
			
			updateCursorTracking(newX, newY);
			
			cursorX = newX;
			cursorY = newY;
		}
	}

	function stopDisco() {
		if (!ctx || !canvas) return;
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		cancelAnimationFrame(animationId);
		isHovering = false;
		lightBeams = [];
		cursorHistory = [];
		volatility = 0;
		targetVolatility = 0;
	}

	function updateCanvasSize() {
		if (!canvas || !container || !ctx) return;
		const bounds = container.getBoundingClientRect();
		const dpr = window.devicePixelRatio || 1;
		
		canvasWidth = bounds.width;
		canvasHeight = bounds.height;
		
		canvas.width = bounds.width * dpr;
		canvas.height = bounds.height * dpr;
		canvas.style.width = `${bounds.width}px`;
		canvas.style.height = `${bounds.height}px`;
		
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.scale(dpr, dpr);
	}

	onMount(() => {
		let resizeObserver: ResizeObserver | null = null;
		let imageLoadHandler: (() => void) | null = null;
		
		const timeoutId = setTimeout(() => {
			canvas = document.getElementById('disco-canvas') as HTMLCanvasElement;
			if (!canvas) return;
			
			ctx = canvas.getContext('2d');
			imageBlock = document.getElementById('disco-image');
			
			if (!ctx || !container) return;
			
			updateCanvasSize();
			
			if (imageBlock instanceof HTMLImageElement) {
				if (imageBlock.complete) {
					updateCanvasSize();
				} else {
					imageLoadHandler = () => updateCanvasSize();
					imageBlock.addEventListener('load', imageLoadHandler, { once: true });
				}
			}
			
			resizeObserver = new ResizeObserver(() => {
				updateCanvasSize();
			});
			
			resizeObserver.observe(container);
		}, 0);
		
		return () => {
			clearTimeout(timeoutId);
			if (resizeObserver) {
				resizeObserver.disconnect();
			}
			if (imageBlock instanceof HTMLImageElement && imageLoadHandler) {
				imageBlock.removeEventListener('load', imageLoadHandler);
			}
		};
	});
</script>

<div
	role="presentation"
	class="disco-block relative w-full overflow-hidden rounded-lg"
	bind:this={container}
	onmousemove={startDisco}
	onmouseleave={stopDisco}
>
	<ImageBlock {image} {alt} {caption} class={className} imageId="disco-image" />
	<canvas class="absolute top-0 left-0 pointer-events-none w-full h-full z-20 rounded-lg" id="disco-canvas"></canvas>

	{#if isHovering}
		<div
			class="disco-cursor pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full z-30"
			style={`left:${cursorX}px;top:${cursorY}px;`}
		></div>
	{/if}
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
