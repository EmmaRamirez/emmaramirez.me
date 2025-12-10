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

	// Light beams state for disco ball physics
	let lightBeams: LightBeam[] = $state([]);
	let time = $state(0);

	// Generate discrete light beams simulating mirror facets
	function generateBeams(count: number = 32): LightBeam[] {
		const beams: LightBeam[] = [];
		
		// Create multiple rings of beams at different distances
		const rings = 4;
		const beamsPerRing = Math.floor(count / rings);
		
		for (let ring = 0; ring < rings; ring++) {
			const ringDistance = 40 + ring * 50; // Distance increases per ring
			const ringSpeed = 0.3 + ring * 0.15; // Outer rings rotate slightly faster
			
			for (let i = 0; i < beamsPerRing; i++) {
				const angleSpread = (Math.PI * 2) / beamsPerRing;
				beams.push({
					baseAngle: i * angleSpread + (ring * 0.5), // Offset each ring
					distance: ringDistance + (Math.random() - 0.5) * 30,
					size: 6 + Math.random() * 10 - ring * 1.5, // Inner beams slightly larger
					speed: ringSpeed + (Math.random() - 0.5) * 0.2,
					brightness: 0.4 + Math.random() * 0.6,
					hue: Math.random() * 60 - 30, // Slight warm/cool variation
					orbitRadius: 5 + Math.random() * 15, // Small orbital wobble
					phaseOffset: Math.random() * Math.PI * 2,
				});
			}
		}
		
		return beams;
	}

	// Draw all light beams with rotation animation
	function drawDiscoBeams() {
		if (!ctx || !canvas) return;
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		for (const beam of lightBeams) {
			// Calculate rotating position - simulates disco ball rotation
			const rotatedAngle = beam.baseAngle + time * beam.speed;
			
			// Add small orbital wobble for more organic movement
			const wobbleX = Math.cos(time * 2 + beam.phaseOffset) * beam.orbitRadius;
			const wobbleY = Math.sin(time * 3 + beam.phaseOffset) * beam.orbitRadius * 0.5;
			
			const x = cursorX + Math.cos(rotatedAngle) * beam.distance + wobbleX;
			const y = cursorY + Math.sin(rotatedAngle) * beam.distance + wobbleY;
			
			// Skip beams outside canvas bounds
			if (x < -beam.size || x > canvas.width + beam.size || 
				y < -beam.size || y > canvas.height + beam.size) {
				continue;
			}
			
			// Pulsing brightness based on angle (simulates facets catching light)
			const angleBrightness = Math.sin(rotatedAngle * 3 + time) * 0.3 + 0.7;
			const finalBrightness = beam.brightness * angleBrightness;
			
			// Draw glowing light spot with radial gradient
			const gradient = ctx.createRadialGradient(x, y, 0, x, y, beam.size);
			
			// Warm white with slight hue variation
			const hue = 45 + beam.hue; // Golden-white base
			const saturation = 20 + Math.abs(beam.hue);
			
			gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, 95%, ${finalBrightness})`);
			gradient.addColorStop(0.3, `hsla(${hue}, ${saturation}%, 85%, ${finalBrightness * 0.7})`);
			gradient.addColorStop(0.6, `hsla(${hue}, ${saturation}%, 70%, ${finalBrightness * 0.3})`);
			gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, 60%, 0)`);
			
			ctx.beginPath();
			ctx.arc(x, y, beam.size, 0, Math.PI * 2);
			ctx.fillStyle = gradient;
			ctx.fill();
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
			lightBeams = generateBeams(36);
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
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		cancelAnimationFrame(animationId);
		isHovering = false;
		lightBeams = [];
	}

	onMount(() => {
		canvas = document.getElementById('disco-canvas') as HTMLCanvasElement;
		ctx = canvas.getContext('2d');
		const imageBlock = document.getElementById('disco-image');
		const imageBlockBounds = imageBlock?.getBoundingClientRect();
		canvas.width = imageBlockBounds?.width ?? 0;
		canvas.height = imageBlockBounds?.height ?? 0;
	});
</script>

<div
	role="presentation"
	class="relative"
	bind:this={container}
	onmousemove={startDisco}
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
