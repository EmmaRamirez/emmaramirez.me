<script lang="ts">
	import { onMount } from 'svelte';
	import { ImageBlock } from '$lib/components/blocks';
	import { discoParams } from '$lib/registry/discoParams';

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

	interface DiscoBall {
		id: number;
		x: number;
		y: number;
		beams: LightBeam[];
		volatility: number;
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

	let discoBalls: DiscoBall[] = $state([]);
	let nextBallId = $state(1);
	let fadeOut = $state(0);

	const SAMPLE_HISTORY_SIZE = discoParams.sampleHistorySize;
	let cursorHistory: CursorSample[] = $state([]);
	let volatility = $state(0);
	let targetVolatility = $state(0);

	const MIN_BEAMS = discoParams.minBeams;
	const MAX_BEAMS = discoParams.maxBeams;
	const CLICK_BEAM_COUNT = discoParams.clickBeamCount;
	const CLICK_BASE_VOLATILITY = discoParams.clickBaseVolatility;
	const VOLATILITY_SMOOTHING = discoParams.volatilitySmoothing;
	const VOLATILITY_DECAY = discoParams.volatilityDecay;

	function shouldAnimate() {
		return isHovering || discoBalls.length > 0 || fadeOut > 0.01 || volatility > 0.01;
	}

	function ensureAnimation() {
		if (!animationId && shouldAnimate()) {
			animationId = requestAnimationFrame(animate);
		}
	}

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

	function getVisibleBeamCount(currentVolatility: number = volatility): number {
		return Math.floor(MIN_BEAMS + (MAX_BEAMS - MIN_BEAMS) * currentVolatility);
	}

	function getBeamReach(): number {
		const baseReach = Math.hypot(canvasWidth, canvasHeight) * 1.05;
		return Math.max(320, baseReach);
	}

	function generateBeams(count: number = 200, reach: number = 400): LightBeam[] {
		const beams: LightBeam[] = [];

		const rings = 10;
		const beamsPerRing = Math.floor(count / rings);
		const ringSpacing = reach / rings;

		for (let ring = 0; ring < rings; ring++) {
			const ringDistance = (ring + 0.5 + Math.random() * 0.25) * ringSpacing;
			const ringSpeed = 0.2 + ring * 0.08;

			for (let i = 0; i < beamsPerRing; i++) {
				const angleSpread = (Math.PI * 2) / beamsPerRing;
				beams.push({
					baseAngle: i * angleSpread + ring * 0.3,
					distance: ringDistance + (Math.random() - 0.5) * ringSpacing * 0.4,
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

	function drawBeamsForSource(
		originX: number,
		originY: number,
		beams: LightBeam[],
		currentVolatility: number,
		fadeFactor: number = 1
	) {
		if (!ctx || !canvas) return;

		const pixelSize = 10;
		const visibleCount = getVisibleBeamCount(currentVolatility);

		for (let i = 0; i < Math.min(visibleCount, beams.length); i++) {
			const beam = beams[i];

			const rotatedAngle = beam.baseAngle + time * beam.speed;

			const volatilityBoost = 1 + currentVolatility * 2;
			const wobbleX = Math.cos(time * 2 + beam.phaseOffset) * beam.orbitRadius * volatilityBoost;
			const wobbleY = Math.sin(time * 3 + beam.phaseOffset) * beam.orbitRadius * 0.5 * volatilityBoost;

			const x = originX + Math.cos(rotatedAngle) * beam.distance + wobbleX;
			const y = originY + Math.sin(rotatedAngle) * beam.distance + wobbleY;

			const snappedX = Math.floor(x / pixelSize) * pixelSize;
			const snappedY = Math.floor(y / pixelSize) * pixelSize;

			if (snappedX < -pixelSize || snappedX > canvasWidth + pixelSize || snappedY < -pixelSize || snappedY > canvasHeight + pixelSize) {
				continue;
			}

			const distanceToCursor = Math.hypot(snappedX - originX, snappedY - originY);
			const falloffRadius = Math.max(canvasWidth, canvasHeight) * 0.85;
			const distanceFade = Math.exp(-distanceToCursor / Math.max(falloffRadius, 1));
			const baseFade = 0.08;
			const visibility = baseFade + distanceFade * (1 - baseFade);

			const pulseIntensity = 0.3 + currentVolatility * 0.3;
			const angleBrightness = Math.sin(rotatedAngle * 3 + time) * pulseIntensity + (1 - pulseIntensity / 2);
		const finalBrightness = beam.brightness * angleBrightness * visibility * fadeFactor;

			const hue = 45 + beam.hue * (1 + currentVolatility);
			const saturation = 15 + Math.abs(beam.hue) * 0.5 + currentVolatility * 20;
			const lightness = 90 + finalBrightness * 10;

			if (finalBrightness < 0.02) continue;

			ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${Math.min(lightness, 100)}%, ${finalBrightness})`;
			ctx.fillRect(snappedX, snappedY, pixelSize, pixelSize);
		}
	}

	function drawAllDiscoBeams(fadeFactor: number = 1) {
		if (!ctx || !canvas) return;

		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		if (isHovering && lightBeams.length) {
			drawBeamsForSource(cursorX, cursorY, lightBeams, volatility, fadeFactor);
		}

		if (discoBalls.length) {
			for (const ball of discoBalls) {
				drawBeamsForSource(ball.x, ball.y, ball.beams, ball.volatility, fadeFactor);
			}
		}
	}

	function animate(timestamp: number) {
		time = timestamp * 0.001;
		updateVolatility();
		const fadeFactor = isHovering ? 1 : fadeOut || 0;
		drawAllDiscoBeams(fadeFactor);

		if (!isHovering && fadeOut > 0) {
			fadeOut *= 0.98;
			if (fadeOut < 0.01) fadeOut = 0;
		}

		if (shouldAnimate()) {
			animationId = requestAnimationFrame(animate);
		} else {
			animationId = 0;
			if (ctx && canvas) {
				ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			}
			lightBeams = [];
			discoBalls = [];
			cursorHistory = [];
			volatility = 0;
			targetVolatility = 0;
			fadeOut = 0;
		}
	}

	function startDisco(event: MouseEvent) {
		if (!isHovering) {
			isHovering = true;
			const beamReach = getBeamReach();
			lightBeams = generateBeams(MAX_BEAMS, beamReach);
			cursorHistory = [];
			volatility = 0;
			targetVolatility = 0;
		}

		if (container) {
			const bounds = container.getBoundingClientRect();
			const newX = event.clientX - bounds.left;
			const newY = event.clientY - bounds.top;

			updateCursorTracking(newX, newY);

			cursorX = newX;
			cursorY = newY;
		}

		ensureAnimation();
	}

	function stopDisco() {
		isHovering = false;
		targetVolatility = 0;
		fadeOut = 1;
		ensureAnimation();
	}

	function updateCanvasSize() {
		if (!canvas || !container || !ctx) return;
		const bounds = container.getBoundingClientRect();
		const dpr = window.devicePixelRatio || 1;

		canvasWidth = bounds.width;
		canvasHeight = bounds.height;

		canvas.width = bounds.width * dpr;
		canvas.height = bounds.height * dpr;
		canvas.style.width = `${bounds.width / 16}rem`;
		canvas.style.height = `${bounds.height / 16}rem`;

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.scale(dpr, dpr);

		if (isHovering) {
			lightBeams = generateBeams(MAX_BEAMS, getBeamReach());
		}

		if (discoBalls.length) {
			const reach = getBeamReach();
			discoBalls = discoBalls.map((ball) => ({
				...ball,
				beams: generateBeams(CLICK_BEAM_COUNT, reach),
			}));
		}

		if (shouldAnimate()) {
			ensureAnimation();
		}
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

	function addDiscoBall(event: MouseEvent) {
		if (!container) return;

		const bounds = container.getBoundingClientRect();
		const x = event.clientX - bounds.left;
		const y = event.clientY - bounds.top;

		const beamReach = getBeamReach();
		const beams = generateBeams(CLICK_BEAM_COUNT, beamReach);
		const ballVolatility = Math.max(volatility, CLICK_BASE_VOLATILITY);

		discoBalls = [
			...discoBalls,
			{
				id: nextBallId++,
				x,
				y,
				beams,
				volatility: ballVolatility,
			},
		];

		ensureAnimation();
	}

	function assignContainer(node: HTMLDivElement) {
		container = node;
		return () => {
			if (container === node) container = null;
		};
	}
</script>

<div
	role="presentation"
	class="disco-block relative w-full overflow-hidden rounded-lg"
	{@attach assignContainer}
	onmousemove={startDisco}
	onmouseleave={stopDisco}
	onclick={addDiscoBall}
>
	<ImageBlock {image} {alt} {caption} class={className} imageId="disco-image" />
	<canvas class="absolute top-0 left-0 pointer-events-none w-full h-full z-20 rounded-lg" id="disco-canvas"></canvas>

	{#if isHovering}
		<div
			class="disco-cursor pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full z-30"
			style={`left:${cursorX / 16}rem;top:${cursorY / 16}rem;`}
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
		width: 2.5rem;
		height: 2.5rem;
		box-shadow: 0 0 1.5625rem rgba(255, 255, 255, 0.9);

		background:
			/* highlight */ radial-gradient(circle at 30% 20%, #ffffff 0, #ffffff 25%, rgba(255, 255, 255, 0) 45%),
			/* bottom shadow */ radial-gradient(circle at 50% 80%, rgba(0, 0, 0, 0.5) 0, rgba(0, 0, 0, 0) 60%),
			/* vertical tiles */ linear-gradient(90deg, rgba(255, 255, 255, 0.18) 0.0625rem, transparent 0.0625rem),
			/* horizontal tiles */ linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0.0625rem, transparent 0.0625rem),
			/* base sphere */ radial-gradient(circle, #d7e0ff 0, #8f96ff 40%, #3c3f7a 70%, #0a0b1d 100%);

		background-size:
			100% 100%,
			100% 100%,
			0.375rem 0.375rem,
			0.375rem 0.375rem,
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
