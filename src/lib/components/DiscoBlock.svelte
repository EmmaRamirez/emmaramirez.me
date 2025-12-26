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

	// Light beams state for disco ball physics
	let lightBeams: LightBeam[] = $state([]);
	let time = $state(0);

	// Generate discrete light beams simulating mirror facets
	function generateBeams(count: number = 80): LightBeam[] {
		const beams: LightBeam[] = [];
		
		// Create multiple rings of beams at different distances
		const rings = 6;
		const beamsPerRing = Math.floor(count / rings);
		
		for (let ring = 0; ring < rings; ring++) {
			const ringDistance = 30 + ring * 35; // Distance increases per ring
			const ringSpeed = 0.25 + ring * 0.1; // Outer rings rotate slightly faster
			
			for (let i = 0; i < beamsPerRing; i++) {
				const angleSpread = (Math.PI * 2) / beamsPerRing;
				beams.push({
					baseAngle: i * angleSpread + (ring * 0.4), // Offset each ring
					distance: ringDistance + (Math.random() - 0.5) * 25,
					size: 6 + Math.random() * 8,
					speed: ringSpeed + (Math.random() - 0.5) * 0.15,
					brightness: 0.5 + Math.random() * 0.5,
					hue: Math.random() * 60 - 30, // Slight warm/cool variation
					orbitRadius: 3 + Math.random() * 10, // Small orbital wobble
					phaseOffset: Math.random() * Math.PI * 2,
				});
			}
		}
		
		return beams;
	}

	// Draw all light beams with rotation animation
	function drawDiscoBeams() {
		if (!ctx || !canvas) return;
		
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		
		const pixelSize = 10; // Square pixel size for that retro look
		
		for (const beam of lightBeams) {
			// Calculate rotating position - simulates disco ball rotation
			const rotatedAngle = beam.baseAngle + time * beam.speed;
			
			// Add small orbital wobble for more organic movement
			const wobbleX = Math.cos(time * 2 + beam.phaseOffset) * beam.orbitRadius;
			const wobbleY = Math.sin(time * 3 + beam.phaseOffset) * beam.orbitRadius * 0.5;
			
			const x = cursorX + Math.cos(rotatedAngle) * beam.distance + wobbleX;
			const y = cursorY + Math.sin(rotatedAngle) * beam.distance + wobbleY;
			
			// Snap to pixel grid for crisp squares
			const snappedX = Math.floor(x / pixelSize) * pixelSize;
			const snappedY = Math.floor(y / pixelSize) * pixelSize;
			
			// Skip beams outside canvas bounds
			if (snappedX < -pixelSize || snappedX > canvasWidth + pixelSize || 
				snappedY < -pixelSize || snappedY > canvasHeight + pixelSize) {
				continue;
			}
			
			// Pulsing brightness based on angle (simulates facets catching light)
			const angleBrightness = Math.sin(rotatedAngle * 3 + time) * 0.3 + 0.7;
			const finalBrightness = beam.brightness * angleBrightness;
			
			// Warm white with slight hue variation
			const hue = 45 + beam.hue;
			const saturation = 15 + Math.abs(beam.hue) * 0.5;
			const lightness = 90 + finalBrightness * 10;
			
			// Draw pixely square
			ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${Math.min(lightness, 100)}%, ${finalBrightness})`;
			ctx.fillRect(snappedX, snappedY, pixelSize, pixelSize);
		}
	}

	// Continuous animation loop for disco ball rotation
	function animate(timestamp: number) {
		time = timestamp * 0.001; // Convert to seconds
		drawDiscoBeams();
		
		if (isHovering) {
			animationId = requestAnimationFrame(animate);
		}
	}

	function startDisco(event: MouseEvent) {
		if (!isHovering) {
			isHovering = true;
			lightBeams = generateBeams(96);
			animationId = requestAnimationFrame(animate);
		}
		
		if (container) {
			const bounds = container.getBoundingClientRect();
			cursorX = event.clientX - bounds.left;
			cursorY = event.clientY - bounds.top;
		}
	}

	function stopDisco() {
		if (!ctx || !canvas) return;
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		cancelAnimationFrame(animationId);
		isHovering = false;
		lightBeams = [];
	}

	function updateCanvasSize() {
		if (!canvas || !imageBlock || !ctx) return;
		const bounds = imageBlock.getBoundingClientRect();
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
		
		// Use setTimeout to ensure DOM is ready
		const timeoutId = setTimeout(() => {
			canvas = document.getElementById('disco-canvas') as HTMLCanvasElement;
			if (!canvas) return;
			
			ctx = canvas.getContext('2d');
			imageBlock = document.getElementById('disco-image');
			
			if (!ctx || !imageBlock) return;
			
			// Update canvas size initially
			updateCanvasSize();
			
			// Update when image loads
			if (imageBlock instanceof HTMLImageElement) {
				if (imageBlock.complete) {
					updateCanvasSize();
				} else {
					imageLoadHandler = () => updateCanvasSize();
					imageBlock.addEventListener('load', imageLoadHandler, { once: true });
				}
			}
			
			// Update on resize
			resizeObserver = new ResizeObserver(() => {
				updateCanvasSize();
			});
			
			resizeObserver.observe(imageBlock);
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
	class="relative w-full"
	bind:this={container}
	onmousemove={startDisco}
	onmouseleave={stopDisco}
>
	<ImageBlock {image} {alt} {caption} class={className} imageId="disco-image">
		<canvas class="absolute top-0 left-0 pointer-events-none w-full h-full" id="disco-canvas"></canvas>

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
