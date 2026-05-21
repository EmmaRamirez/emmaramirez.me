<script lang="ts">
	import { achievementsStore } from '$lib/stores/achievementsStore.svelte';

	type LightBeam = {
		baseAngle: number;
		brightness: number;
		distance: number;
		hue: number;
		orbitRadius: number;
		phaseOffset: number;
		size: number;
		speed: number;
	};

	type DiscoBall = {
		beams: LightBeam[];
		volatility: number;
		x: number;
		y: number;
	};

	type CursorSample = {
		time: number;
		x: number;
		y: number;
	};

	type Props = {
		alt: string;
		caption?: string;
		class?: string;
		effectsEnabled?: boolean;
		image: string;
	};

	const discoParams = {
		clickBaseVolatility: 0.7,
		clickBeamCount: 420,
		maxBeams: 800,
		minBeams: 60,
		sampleHistorySize: 12,
		volatilityDecay: 0.92,
		volatilitySmoothing: 0.15
	};

	let {
		alt,
		caption = 'Disco',
		class: className = '',
		effectsEnabled = true,
		image
	}: Props = $props();

	let cursorVisible = $state(false);
	let cursorX = $state(0);
	let cursorY = $state(0);

	function getVisibleBeamCount(volatility: number) {
		return Math.floor(
			discoParams.minBeams + (discoParams.maxBeams - discoParams.minBeams) * volatility
		);
	}

	function generateBeams(count = discoParams.maxBeams, reach = 400): LightBeam[] {
		const beams: LightBeam[] = [];
		const rings = 10;
		const beamsPerRing = Math.floor(count / rings);
		const ringSpacing = reach / rings;

		for (let ring = 0; ring < rings; ring += 1) {
			const ringDistance = (ring + 0.5 + Math.random() * 0.25) * ringSpacing;
			const ringSpeed = 0.2 + ring * 0.08;

			for (let index = 0; index < beamsPerRing; index += 1) {
				const angleSpread = (Math.PI * 2) / beamsPerRing;
				beams.push({
					baseAngle: index * angleSpread + ring * 0.3,
					brightness: 0.4 + Math.random() * 0.6,
					distance: ringDistance + (Math.random() - 0.5) * ringSpacing * 0.4,
					hue: Math.random() * 80 - 40,
					orbitRadius: 2 + Math.random() * 12,
					phaseOffset: Math.random() * Math.PI * 2,
					size: 5 + Math.random() * 10,
					speed: ringSpeed + (Math.random() - 0.5) * 0.12
				});
			}
		}

		return beams;
	}

	function setupDisco(node: HTMLDivElement) {
		const canvas = node.querySelector<HTMLCanvasElement>('.disco-block__canvas');
		const ctx = canvas?.getContext('2d');
		if (!canvas || !ctx || !effectsEnabled) return;
		const canvasElement = canvas;
		const context = ctx;

		let animationId = 0;
		let canvasWidth = 0;
		let canvasHeight = 0;
		let containerBounds = node.getBoundingClientRect();
		let lightBeams: LightBeam[] = [];
		let discoBalls: DiscoBall[] = [];
		let cursorHistory: CursorSample[] = [];
		let cursorHistoryIndex = 0;
		let cursorHistoryCount = 0;
		let fadeOut = 0;
		let hasPendingCursor = false;
		let hovering = false;
		let pendingCursorX = 0;
		let pendingCursorY = 0;
		let targetVolatility = 0;
		let time = 0;
		let volatility = 0;

		function shouldAnimate() {
			return hovering || discoBalls.length > 0 || fadeOut > 0.01 || volatility > 0.01;
		}

		function ensureAnimation() {
			if (!animationId && shouldAnimate()) {
				animationId = requestAnimationFrame(animate);
			}
		}

		function getBeamReach() {
			const baseReach = Math.hypot(canvasWidth, canvasHeight) * 1.05;
			return Math.max(320, baseReach);
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
				const keepCount = Math.min(cursorHistoryCount, limit - 1);
				const recentSamples = Array.from({ length: keepCount }, (_, index) =>
					getCursorSample(Math.max(0, cursorHistoryCount - keepCount + index))
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

		function calculateVolatility() {
			if (cursorHistoryCount < 3) return 0;

			let totalSpeed = 0;
			let directionChanges = 0;
			let prevDx = 0;
			let prevDy = 0;

			for (let index = 1; index < cursorHistoryCount; index += 1) {
				const prev = getCursorSample(index - 1);
				const curr = getCursorSample(index);
				const dt = Math.max(curr.time - prev.time, 1);
				const dx = curr.x - prev.x;
				const dy = curr.y - prev.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				totalSpeed += distance / dt;

				if (index > 1) {
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

			return Math.min(speedFactor * 0.6 + avgDirectionChange * 0.4, 1);
		}

		function updateCursorTracking(x: number, y: number) {
			pushCursorSample({ time: performance.now(), x, y });
			targetVolatility = calculateVolatility();
		}

		function consumePendingCursor() {
			if (!hasPendingCursor) return;
			hasPendingCursor = false;
			cursorX = pendingCursorX;
			cursorY = pendingCursorY;
			updateCursorTracking(cursorX, cursorY);
		}

		function updateVolatility() {
			if (targetVolatility > volatility) {
				volatility += (targetVolatility - volatility) * discoParams.volatilitySmoothing;
			} else {
				volatility *= discoParams.volatilityDecay;
				if (volatility < 0.01) volatility = 0;
			}
		}

		function drawBeamsForSource(
			originX: number,
			originY: number,
			beams: LightBeam[],
			currentVolatility: number,
			fadeFactor = 1
		) {
			const pixelSize = 10;
			const visibleCount = getVisibleBeamCount(currentVolatility);

			for (let index = 0; index < Math.min(visibleCount, beams.length); index += 1) {
				const beam = beams[index];
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
				const visibility = 0.08 + distanceFade * 0.92;
				const pulseIntensity = 0.3 + currentVolatility * 0.3;
				const angleBrightness =
					Math.sin(rotatedAngle * 3 + time) * pulseIntensity + (1 - pulseIntensity / 2);
				const finalBrightness = beam.brightness * angleBrightness * visibility * fadeFactor;

				if (finalBrightness < 0.02) continue;

				const hue = 45 + beam.hue * (1 + currentVolatility);
				const saturation = 15 + Math.abs(beam.hue) * 0.5 + currentVolatility * 20;
				const lightness = Math.min(90 + finalBrightness * 10, 100);

				context.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${finalBrightness})`;
				context.fillRect(snappedX, snappedY, pixelSize, pixelSize);
			}
		}

		function drawAllDiscoBeams(fadeFactor = 1) {
			context.clearRect(0, 0, canvasWidth, canvasHeight);

			if (hovering && lightBeams.length) {
				drawBeamsForSource(cursorX, cursorY, lightBeams, volatility, fadeFactor);
			}

			for (const ball of discoBalls) {
				drawBeamsForSource(ball.x, ball.y, ball.beams, ball.volatility, fadeFactor);
			}
		}

		function animate(timestamp: number) {
			time = timestamp * 0.001;
			consumePendingCursor();
			updateVolatility();
			drawAllDiscoBeams(hovering ? 1 : fadeOut || 0);

			if (!hovering && fadeOut > 0) {
				fadeOut *= 0.98;
				if (fadeOut < 0.01) fadeOut = 0;
			}

			if (shouldAnimate()) {
				animationId = requestAnimationFrame(animate);
			} else {
				animationId = 0;
				context.clearRect(0, 0, canvasWidth, canvasHeight);
				lightBeams = [];
				discoBalls = [];
				resetCursorHistory();
				volatility = 0;
				targetVolatility = 0;
				fadeOut = 0;
			}
		}

		function resize() {
			containerBounds = node.getBoundingClientRect();
			const dpr = window.devicePixelRatio || 1;
			canvasWidth = containerBounds.width;
			canvasHeight = containerBounds.height;
			canvasElement.width = Math.max(1, Math.floor(canvasWidth * dpr));
			canvasElement.height = Math.max(1, Math.floor(canvasHeight * dpr));
			context.setTransform(dpr, 0, 0, dpr, 0, 0);

			if (hovering) {
				lightBeams = generateBeams(discoParams.maxBeams, getBeamReach());
			}

			if (discoBalls.length) {
				const reach = getBeamReach();
				discoBalls = discoBalls.map((ball) => ({
					...ball,
					beams: generateBeams(discoParams.clickBeamCount, reach)
				}));
			}

			ensureAnimation();
		}

		function beginHoverSession() {
			if (hovering) return;
			hovering = true;
			cursorVisible = true;
			containerBounds = node.getBoundingClientRect();
			lightBeams = generateBeams(discoParams.maxBeams, getBeamReach());
			resetCursorHistory();
			volatility = 0;
			targetVolatility = 0;
		}

		function handlePointerMove(event: PointerEvent) {
			beginHoverSession();
			pendingCursorX = event.clientX - containerBounds.left;
			pendingCursorY = event.clientY - containerBounds.top;
			hasPendingCursor = true;
			ensureAnimation();
		}

		function handlePointerLeave() {
			hovering = false;
			cursorVisible = false;
			hasPendingCursor = false;
			targetVolatility = 0;
			fadeOut = 1;
			ensureAnimation();
		}

		function handleClick(event: PointerEvent) {
			achievementsStore.unlock('boogie-all-night-long', {
				animateIfPriorUnlocks: true
			});

			const x = event.clientX - containerBounds.left;
			const y = event.clientY - containerBounds.top;
			discoBalls = [
				...discoBalls,
				{
					beams: generateBeams(discoParams.clickBeamCount, getBeamReach()),
					volatility: Math.max(volatility, discoParams.clickBaseVolatility),
					x,
					y
				}
			];
			ensureAnimation();
		}

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(node);
		resize();

		node.addEventListener('pointermove', handlePointerMove);
		node.addEventListener('pointerleave', handlePointerLeave);
		node.addEventListener('pointerdown', handleClick);

		return () => {
			cancelAnimationFrame(animationId);
			resizeObserver.disconnect();
			node.removeEventListener('pointermove', handlePointerMove);
			node.removeEventListener('pointerleave', handlePointerLeave);
			node.removeEventListener('pointerdown', handleClick);
		};
	}
</script>

<div
	class={['disco-block', className]}
	aria-label="Interactive disco block"
	role="img"
	{@attach setupDisco}
>
	<img class="disco-block__image" src={image} {alt} />
	<div class="disco-block__wash"></div>
	<canvas class="disco-block__canvas"></canvas>
	<div
		class={['disco-block__cursor', cursorVisible && 'disco-block__cursor--visible']}
		style:--cursor-x={`${cursorX}px`}
		style:--cursor-y={`${cursorY}px`}
	></div>
	{#if caption}
		<span class="disco-block__caption">{caption}</span>
	{/if}
</div>

<style>
	.disco-block {
		position: relative;
		isolation: isolate;
		width: min(100%, 500px);
		min-width: 0;
		min-height: min(16rem, calc(100vw - 2rem));
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--border-color) 58%, transparent);
		border-radius: 1.5rem;
		background:
			radial-gradient(circle at 20% 20%, rgba(237, 156, 239, 0.34), transparent 14rem),
			radial-gradient(circle at 78% 72%, rgba(184, 255, 229, 0.28), transparent 12rem),
			var(--card-bg);
		cursor: inherit;
	}

	.disco-block__image,
	.disco-block__wash,
	.disco-block__canvas {
		position: absolute;
		inset: 0;
	}

	.disco-block__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.74;
		filter: saturate(0.92) contrast(1.04);
	}

	.disco-block__wash {
		z-index: 1;
		font-family: var(--font-sans);
		background:
			linear-gradient(180deg, rgba(10, 11, 29, 0.16), rgba(10, 11, 29, 0.68)),
			radial-gradient(circle at 50% 42%, transparent 0 24%, rgba(10, 11, 29, 0.46) 68%);
	}

	.disco-block__canvas {
		z-index: 2;
		width: 100%;
		height: 100%;
		mix-blend-mode: screen;
		pointer-events: none;
	}

	.disco-block__cursor {
		position: absolute;
		z-index: 3;
		top: var(--cursor-y, 50%);
		left: var(--cursor-x, 50%);
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 999px;
		opacity: 0;
		pointer-events: none;
		transform: translate(-50%, -50%);
		transition: opacity 120ms ease;
		background:
			radial-gradient(circle at 30% 20%, #ffffff 0, #ffffff 25%, rgba(255, 255, 255, 0) 45%),
			radial-gradient(circle at 50% 80%, rgba(0, 0, 0, 0.5) 0, rgba(0, 0, 0, 0) 60%),
			linear-gradient(90deg, rgba(255, 255, 255, 0.18) 0.0625rem, transparent 0.0625rem),
			linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0.0625rem, transparent 0.0625rem),
			radial-gradient(circle, #d7e0ff 0, #8f96ff 42%, #3c3f7a 72%, #0a0b1d 100%);
		background-size:
			100% 100%,
			100% 100%,
			0.375rem 0.375rem,
			0.375rem 0.375rem,
			100% 100%;
		background-repeat: no-repeat, no-repeat, repeat, repeat, no-repeat;
		box-shadow:
			0 0 1.5625rem rgba(255, 255, 255, 0.9),
			0 0 3rem rgba(184, 255, 229, 0.34);
		animation: disco-glint 1.8s ease-in-out infinite;
	}

	.disco-block__cursor--visible {
		opacity: 1;
	}

	.disco-block__caption {
		position: absolute;
		z-index: 4;
		right: 1rem;
		bottom: 0.9rem;
		left: 1rem;
		color: white;
		font-family: var(--font-pixel), var(--font-sans);
		font-size: clamp(1.35rem, 4vw, 2.6rem);
		line-height: 0.9;
		text-align: center;
	}

	@media (min-width: 48rem) {
		.disco-block {
			min-height: 100%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.disco-block__cursor {
			animation: none;
			transition: none;
		}
	}

	@keyframes disco-glint {
		0%,
		100% {
			filter: brightness(1) hue-rotate(0deg);
		}

		50% {
			filter: brightness(1.3) hue-rotate(15deg);
		}
	}
</style>
