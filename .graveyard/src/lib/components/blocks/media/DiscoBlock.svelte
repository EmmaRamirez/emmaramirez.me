<script lang="ts">
	import { onMount } from 'svelte';
	import { ImageBlock } from '$lib/components/blocks';
	import { discoParams } from '$lib/stores/discoParams.svelte';
	import { performanceAnalytics } from '$lib/stores/performanceAnalytics.svelte';

	interface DiscoBlockProps {
		image: string;
		alt: string;
		caption: string;
		class: string;
		effectsEnabled?: boolean;
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

	let { image, alt, caption, class: className, effectsEnabled = true }: DiscoBlockProps = $props();

	let animationId = 0;
	let canvas: HTMLCanvasElement | null = null;
	let ctx: CanvasRenderingContext2D | null = null;

	let isHovering = $state(false);
	let container: HTMLDivElement | null = null;
	let imageBlock: HTMLElement | null = null;
	let cursorEl: HTMLDivElement | null = null;
	let containerBounds: DOMRect | null = null;
	let canvasWidth = 0;
	let canvasHeight = 0;

	let lightBeams: LightBeam[] = [];
	let time = 0;

	let discoBalls: DiscoBall[] = [];
	let nextBallId = 1;
	let fadeOut = 0;

	let cursorX = 0;
	let cursorY = 0;
	let pendingCursorX = 0;
	let pendingCursorY = 0;
	let hasPendingCursor = false;

	let cursorHistory: CursorSample[] = [];
	let cursorHistoryIndex = 0;
	let cursorHistoryCount = 0;
	let volatility = 0;
	let targetVolatility = 0;
	const discoReadyMeasureId = performanceAnalytics.beginMeasure('render', 'DiscoBlock ready', {
		source: 'DiscoBlock'
	});
	let hasRecordedDiscoReady = false;
	let discoHoverMeasureId: string | null = null;

	function shouldAnimate() {
		return (
			effectsEnabled && (isHovering || discoBalls.length > 0 || fadeOut > 0.01 || volatility > 0.01)
		);
	}

	function ensureAnimation() {
		if (!animationId && shouldAnimate()) {
			animationId = requestAnimationFrame(animate);
		}
	}

	function calculateVolatility(): number {
		if (cursorHistoryCount < 3) return 0;

		let totalSpeed = 0;
		let directionChanges = 0;
		let prevDx = 0;
		let prevDy = 0;

		for (let i = 1; i < cursorHistoryCount; i++) {
			const prev = getCursorSample(i - 1);
			const curr = getCursorSample(i);
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

		const avgSpeed = totalSpeed / (cursorHistoryCount - 1);
		const avgDirectionChange = directionChanges / Math.max(cursorHistoryCount - 2, 1);

		const speedFactor = Math.min(avgSpeed / 3, 1);
		const directionFactor = avgDirectionChange;

		return Math.min(speedFactor * 0.6 + directionFactor * 0.4, 1);
	}

	function resetCursorHistory() {
		cursorHistory = [];
		cursorHistoryIndex = 0;
		cursorHistoryCount = 0;
	}

	function getCursorSample(index: number) {
		const start =
			(cursorHistoryIndex - cursorHistoryCount + cursorHistory.length) % cursorHistory.length;
		return cursorHistory[(start + index) % cursorHistory.length];
	}

	function pushCursorSample(sample: CursorSample) {
		const limit = discoParams.sampleHistorySize;
		if (limit <= 0) {
			resetCursorHistory();
			return;
		}

		if (cursorHistory.length !== limit) {
			const recentSamples = Array.from(
				{ length: Math.min(cursorHistoryCount, limit - 1) },
				(_, index) =>
					getCursorSample(
						Math.max(0, cursorHistoryCount - Math.min(cursorHistoryCount, limit - 1) + index)
					)
			);
			cursorHistory = recentSamples;
			cursorHistoryIndex = recentSamples.length % limit;
			cursorHistoryCount = recentSamples.length;
		}

		if (cursorHistory.length < limit) {
			cursorHistory.push(sample);
			cursorHistoryCount = cursorHistory.length;
			cursorHistoryIndex = cursorHistory.length % limit;
			return;
		}

		cursorHistory[cursorHistoryIndex] = sample;
		cursorHistoryIndex = (cursorHistoryIndex + 1) % limit;
		cursorHistoryCount = limit;
	}

	function updateCursorTracking(x: number, y: number) {
		const now = performance.now();

		pushCursorSample({ x, y, time: now });
		targetVolatility = calculateVolatility();
	}

	function updateCursorVisual() {
		if (!cursorEl) return;
		cursorEl.style.left = `${cursorX / 16}rem`;
		cursorEl.style.top = `${cursorY / 16}rem`;
	}

	function consumePendingCursor() {
		if (!hasPendingCursor) return;
		hasPendingCursor = false;
		cursorX = pendingCursorX;
		cursorY = pendingCursorY;
		updateCursorTracking(cursorX, cursorY);
		updateCursorVisual();
	}

	function updateVolatility() {
		if (targetVolatility > volatility) {
			volatility += (targetVolatility - volatility) * discoParams.volatilitySmoothing;
		} else {
			volatility *= discoParams.volatilityDecay;
			if (volatility < 0.01) volatility = 0;
		}
	}

	function getVisibleBeamCount(currentVolatility: number = volatility): number {
		const minBeams = Math.min(discoParams.minBeams, discoParams.maxBeams);
		const maxBeams = Math.max(discoParams.minBeams, discoParams.maxBeams);
		return Math.floor(minBeams + (maxBeams - minBeams) * currentVolatility);
	}

	function getBeamReach(): number {
		const baseReach = Math.hypot(canvasWidth, canvasHeight) * 1.05;
		return Math.max(320, baseReach);
	}

	function generateBeams(count: number = discoParams.maxBeams, reach: number = 400): LightBeam[] {
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
					phaseOffset: Math.random() * Math.PI * 2
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
			const wobbleY =
				Math.sin(time * 3 + beam.phaseOffset) * beam.orbitRadius * 0.5 * volatilityBoost;

			const x = originX + Math.cos(rotatedAngle) * beam.distance + wobbleX;
			const y = originY + Math.sin(rotatedAngle) * beam.distance + wobbleY;

			const snappedX = Math.floor(x / pixelSize) * pixelSize;
			const snappedY = Math.floor(y / pixelSize) * pixelSize;

			if (
				snappedX < -pixelSize ||
				snappedX > canvasWidth + pixelSize ||
				snappedY < -pixelSize ||
				snappedY > canvasHeight + pixelSize
			) {
				continue;
			}

			const distanceToCursor = Math.hypot(snappedX - originX, snappedY - originY);
			const falloffRadius = Math.max(canvasWidth, canvasHeight) * 0.85;
			const distanceFade = Math.exp(-distanceToCursor / Math.max(falloffRadius, 1));
			const baseFade = 0.08;
			const visibility = baseFade + distanceFade * (1 - baseFade);

			const pulseIntensity = 0.3 + currentVolatility * 0.3;
			const angleBrightness =
				Math.sin(rotatedAngle * 3 + time) * pulseIntensity + (1 - pulseIntensity / 2);
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
		consumePendingCursor();
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
			resetCursorHistory();
			volatility = 0;
			targetVolatility = 0;
			fadeOut = 0;
		}
	}

	function beginHoverSession() {
		if (!effectsEnabled) return;
		if (isHovering) return;

		isHovering = true;
		containerBounds = container?.getBoundingClientRect() ?? null;
		const beamReach = getBeamReach();
		lightBeams = generateBeams(discoParams.maxBeams, beamReach);
		resetCursorHistory();
		volatility = 0;
		targetVolatility = 0;
		discoHoverMeasureId = performanceAnalytics.beginMeasure('interaction', 'Disco hover session', {
			source: 'DiscoBlock'
		});
	}

	function handlePointerMove(event: MouseEvent) {
		if (!effectsEnabled) return;
		beginHoverSession();

		if (!containerBounds) {
			containerBounds = container?.getBoundingClientRect() ?? null;
		}

		if (!containerBounds) return;

		pendingCursorX = event.clientX - containerBounds.left;
		pendingCursorY = event.clientY - containerBounds.top;
		hasPendingCursor = true;
		ensureAnimation();
	}

	function stopDisco() {
		if (!effectsEnabled) return;
		isHovering = false;
		hasPendingCursor = false;
		targetVolatility = 0;
		fadeOut = 1;
		performanceAnalytics.endMeasure(discoHoverMeasureId, {
			source: 'DiscoBlock',
			detail: `${discoBalls.length} click beams`
		});
		discoHoverMeasureId = null;
		ensureAnimation();
	}

	function updateCanvasSize() {
		if (!canvas || !container || !ctx) return;
		const bounds = container.getBoundingClientRect();
		containerBounds = bounds;
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
			lightBeams = generateBeams(discoParams.maxBeams, getBeamReach());
		}

		if (discoBalls.length) {
			const reach = getBeamReach();
			discoBalls = discoBalls.map((ball) => ({
				...ball,
				beams: generateBeams(discoParams.clickBeamCount, reach)
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
			if (!hasRecordedDiscoReady) {
				hasRecordedDiscoReady = true;
				performanceAnalytics.endMeasure(discoReadyMeasureId, {
					source: 'DiscoBlock',
					detail: `${Math.round(canvasWidth)}x${Math.round(canvasHeight)} canvas`
				});
			}

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
			performanceAnalytics.endMeasure(discoHoverMeasureId, {
				source: 'DiscoBlock',
				detail: 'unmounted'
			});
			discoHoverMeasureId = null;
			if (resizeObserver) {
				resizeObserver.disconnect();
			}
			if (imageBlock instanceof HTMLImageElement && imageLoadHandler) {
				imageBlock.removeEventListener('load', imageLoadHandler);
			}
		};
	});

	function addDiscoBall(event: MouseEvent) {
		if (!effectsEnabled) return;
		if (!container) return;

		const bounds = containerBounds ?? container.getBoundingClientRect();
		const x = event.clientX - bounds.left;
		const y = event.clientY - bounds.top;

		const beamReach = getBeamReach();
		const beams = generateBeams(discoParams.clickBeamCount, beamReach);
		const ballVolatility = Math.max(volatility, discoParams.clickBaseVolatility);

		discoBalls = [
			...discoBalls,
			{
				id: nextBallId++,
				x,
				y,
				beams,
				volatility: ballVolatility
			}
		];

		ensureAnimation();
	}

	function assignContainer(node: HTMLDivElement) {
		container = node;
		return () => {
			if (container === node) container = null;
		};
	}

	$effect(() => {
		if (effectsEnabled) return;

		if (animationId) {
			cancelAnimationFrame(animationId);
			animationId = 0;
		}

		isHovering = false;
		hasPendingCursor = false;
		lightBeams = [];
		discoBalls = [];
		resetCursorHistory();
		volatility = 0;
		targetVolatility = 0;
		fadeOut = 0;
		performanceAnalytics.endMeasure(discoHoverMeasureId, {
			source: 'DiscoBlock',
			detail: 'effects disabled'
		});
		discoHoverMeasureId = null;

		if (ctx && canvas) {
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		}
	});
</script>

<div
	role="presentation"
	class="disco-block relative w-full overflow-hidden rounded-lg"
	{@attach assignContainer}
	onmousemove={handlePointerMove}
	onmouseleave={stopDisco}
	onclick={addDiscoBall}
>
	<ImageBlock {image} {alt} {caption} class={className} imageId="disco-image" />
	<canvas
		class="pointer-events-none absolute top-0 left-0 z-20 h-full w-full rounded-lg"
		class:hidden={!effectsEnabled}
		id="disco-canvas"
	></canvas>

	<div
		bind:this={cursorEl}
		class="disco-cursor pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 rounded-full"
		class:hidden={!effectsEnabled}
		class:is-active={effectsEnabled && isHovering}
	></div>
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
		opacity: 0;
		transition: opacity 120ms ease;

		background:
			/* highlight */
			radial-gradient(circle at 30% 20%, #ffffff 0, #ffffff 25%, rgba(255, 255, 255, 0) 45%),
			/* bottom shadow */
			radial-gradient(circle at 50% 80%, rgba(0, 0, 0, 0.5) 0, rgba(0, 0, 0, 0) 60%),
			/* vertical tiles */
			linear-gradient(90deg, rgba(255, 255, 255, 0.18) 0.0625rem, transparent 0.0625rem),
			/* horizontal tiles */
			linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0.0625rem, transparent 0.0625rem),
			/* base sphere */ radial-gradient(circle, #d7e0ff 0, #8f96ff 40%, #3c3f7a 70%, #0a0b1d 100%);

		background-size:
			100% 100%,
			100% 100%,
			0.375rem 0.375rem,
			0.375rem 0.375rem,
			100% 100%;

		background-repeat: no-repeat, no-repeat, repeat, repeat, no-repeat;

		animation: disco-glint 1.8s ease-in-out infinite;
	}

	.disco-cursor.is-active {
		opacity: 1;
	}
</style>
