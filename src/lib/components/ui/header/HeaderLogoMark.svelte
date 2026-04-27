<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	let container: HTMLDivElement | undefined = $state();
	let webglHost: HTMLDivElement | undefined = $state();

	let mediaReady = $state(false);
	let webglOk = $state(false);
	let prefersReducedMotion = $state(false);

	/** Pointer + media — plain object so RAF always reads latest (no stale $state closures). */
	const ptr = {
		targetX: 0.5,
		targetY: 0.5,
		hovering: false,
		/** Cursor wake multiplier: 0 = coarse / doc “no wake”; scaled down for reduced motion. */
		wakeMix: 1,
		/** Idle aurora speed; very slow when prefers-reduced-motion. */
		timeScale: 1,
		/** Click pulse strength; reduced but not disabled for reduced-motion users. */
		zapMix: 1,
		zapPending: false,
		zapX: 0.5,
		zapY: 0.5
	};

	let mqMotion: MediaQueryList | undefined;
	let mqPointer: MediaQueryList | undefined;

	function readCssColor(target: Element, propertyName: string, fallback: string): THREE.Color {
		const color = new THREE.Color(fallback);
		const value = getComputedStyle(target).getPropertyValue(propertyName).trim();
		if (!value) return color;
		try {
			color.setStyle(value);
		} catch {
			return new THREE.Color(fallback);
		}
		return color;
	}

	function canUseWebGL(): boolean {
		if (typeof document === 'undefined') return false;
		const test = document.createElement('canvas');
		return !!(test.getContext('webgl') ?? test.getContext('webgl2'));
	}

	function applyMediaFromMq() {
		if (!browser || !mqMotion || !mqPointer) return;
		const reduced = mqMotion.matches;
		const coarse = mqPointer.matches;
		prefersReducedMotion = reduced;
		ptr.wakeMix = coarse ? 0 : reduced ? 0.35 : 1;
		ptr.timeScale = reduced ? 0.18 : 1;
		ptr.zapMix = reduced ? 0.55 : 1;
	}

	function pointerInsideMark(clientX: number, clientY: number): boolean {
		if (!container) return false;
		const rect = container.getBoundingClientRect();
		if (rect.width <= 0 || rect.height <= 0) return false;
		return (
			clientX >= rect.left &&
			clientX <= rect.right &&
			clientY >= rect.top &&
			clientY <= rect.bottom
		);
	}

	function applyPointerPosition(clientX: number, clientY: number) {
		if (!container) return;
		const rect = container.getBoundingClientRect();
		if (rect.width <= 0 || rect.height <= 0) return;
		ptr.targetX = (clientX - rect.left) / rect.width;
		ptr.targetY = 1 - (clientY - rect.top) / rect.height;
	}

	function updatePointer(event: PointerEvent) {
		applyPointerPosition(event.clientX, event.clientY);
	}

	function handlePointerEnter() {
		ptr.hovering = true;
	}

	function handlePointerLeave() {
		ptr.hovering = false;
	}

	function triggerZap(clientX: number, clientY: number) {
		applyPointerPosition(clientX, clientY);
		ptr.zapX = ptr.targetX;
		ptr.zapY = ptr.targetY;
		ptr.zapPending = true;
		ptr.hovering = true;
	}

	function handlePointerDown(event: PointerEvent) {
		triggerZap(event.clientX, event.clientY);
	}

	function handleWindowPointerMove(event: PointerEvent) {
		if (!pointerInsideMark(event.clientX, event.clientY)) {
			ptr.hovering = false;
			return;
		}
		ptr.hovering = true;
		applyPointerPosition(event.clientX, event.clientY);
	}

	onMount(() => {
		webglOk = canUseWebGL();
		mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		mqPointer = window.matchMedia('(pointer: coarse)');
		applyMediaFromMq();
		mediaReady = true;

		const onMq = () => applyMediaFromMq();
		mqMotion.addEventListener('change', onMq);
		mqPointer.addEventListener('change', onMq);
		window.addEventListener('pointermove', handleWindowPointerMove, { passive: true });

		return () => {
			mqMotion?.removeEventListener('change', onMq);
			mqPointer?.removeEventListener('change', onMq);
			window.removeEventListener('pointermove', handleWindowPointerMove);
		};
	});

	const vertexShader = `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`;

	const fragmentShader = `
		uniform float uTime;
		uniform vec2 uPointer;
		uniform float uWakeEnergy;
		uniform float uHover;
		uniform float uWakeMix;
		uniform float uZapEnergy;
		uniform vec2 uZapOrigin;
		uniform float uZapMix;
		uniform vec3 uBaseColor;
		uniform vec3 uPrimaryColor;
		uniform vec3 uSecondaryColor;
		uniform vec3 uMintColor;
		uniform vec3 uPinkColor;

		varying vec2 vUv;

		float hash(vec2 p) {
			return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
		}

		float noise(vec2 p) {
			vec2 i = floor(p);
			vec2 f = fract(p);
			vec2 u = f * f * (3.0 - 2.0 * f);
			return mix(
				mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
				mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
				u.y
			);
		}

		void main() {
			vec2 uv = vUv;
			vec2 p = uv - uPointer;
			float dist = length(p);

			float t = uTime * 0.35;
			vec2 drift = vec2(
				sin(t * 0.7 + uv.y * 3.1) * 0.06,
				cos(t * 0.55 + uv.x * 2.8) * 0.06
			);
			float n = noise(uv * 5.5 + drift * 2.0 + t * 0.2);
			float n2 = noise(uv * 11.0 - t * 0.1);

			float wake = exp(-dist * 4.8) * uHover * 0.85;
			float ribbon = exp(-abs(p.x * 2.1 + p.y * 1.05) * 2.8) * uWakeEnergy * uWakeMix * 1.15;
			float ribbon2 = smoothstep(0.14, 0.0, abs(p.y + p.x * 0.35 - 0.08)) * uWakeEnergy * uWakeMix * 0.55;
			vec2 zapOffset = uv - uZapOrigin;
			float zapDist = length(zapOffset);
			float zapProgress = 1.0 - uZapEnergy;
			float zapRing = smoothstep(0.055, 0.0, abs(zapDist - (0.05 + zapProgress * 0.42))) * uZapEnergy * uZapMix;
			float zapCore = exp(-zapDist * 18.0) * uZapEnergy * uZapMix;

			vec3 baseCol = uBaseColor;
			vec3 blue = uPrimaryColor;
			vec3 coral = uSecondaryColor;
			vec3 mint = uMintColor;
			vec3 pink = uPinkColor;

			float aurora = n * 0.45 + n2 * 0.18;
			float flow = sin(uv.x * 6.2 + uv.y * 4.1 + t * 1.4) * 0.5 + 0.5
				+ sin(uv.y * 7.0 - t * 0.9) * 0.22;

			float idlePulse = 0.22 + 0.12 * sin(t * 0.65) + 0.08 * sin(t * 1.1 + uv.x * 4.0);
			vec3 idleGlow = mix(blue, coral, flow * 0.5 + aurora * 0.2) * idlePulse * 0.35;

			vec3 col = baseCol;
			float auroraMix = 0.58 + aurora * 0.32;
			col = mix(col, mix(blue, coral, flow * 0.6 + aurora * 0.3), auroraMix);
			col += idleGlow;
			col += blue * wake * 0.75;
			col += mix(coral, blue, 0.45) * ribbon;
			col += coral * ribbon2 * 0.75;
			col += mix(coral, pink, 0.45) * zapRing * 1.45;
			col += mix(mint, vec3(1.0), 0.55) * zapCore * 0.7;

			float hi = max(0.0, uWakeEnergy - 0.45) * uWakeMix;
			col = mix(col, mix(col, mint, 0.22), hi);
			col = mix(col, mix(col, pink, 0.16), hi * 0.75);
			col = mix(col, mix(col, vec3(1.0), 0.32), zapCore * 0.45);

			float grain = noise(uv * 120.0 + vec2(uTime * 6.0, -uTime * 4.0));
			col += (grain - 0.5) * 0.045;

			float vignette = smoothstep(0.88, 0.25, length(uv - 0.5));
			col *= 0.9 + vignette * 0.1;

			gl_FragColor = vec4(col, 1.0);
		}
	`;

	$effect(() => {
		if (!browser || !mediaReady || !webglOk || !webglHost) return;

		const host = webglHost;
		const CURSOR_DAMPING = 5.5;
		const WAKE_DECAY = 3.2;
		const ZAP_DECAY = 8.5;
		const SETTLE_MS = 0.25;

		const sim = {
			time: 0,
			currentX: 0.5,
			currentY: 0.5,
			prevTargetX: 0.5,
			prevTargetY: 0.5,
			wakeEnergy: 0,
			hoverProgress: 0,
			zapEnergy: 0,
			zapX: 0.5,
			zapY: 0.5
		};

		const scene = new THREE.Scene();
		const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
		camera.position.set(0, 0, 1);
		camera.lookAt(0, 0, 0);

		const material = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uPointer: { value: new THREE.Vector2(0.5, 0.5) },
				uWakeEnergy: { value: 0 },
				uHover: { value: 0 },
				uWakeMix: { value: 1 },
				uZapEnergy: { value: 0 },
				uZapOrigin: { value: new THREE.Vector2(0.5, 0.5) },
				uZapMix: { value: 1 },
				uBaseColor: { value: new THREE.Color('#171523') },
				uPrimaryColor: { value: new THREE.Color('#6b9eff') },
				uSecondaryColor: { value: new THREE.Color('#ff856b') },
				uMintColor: { value: new THREE.Color('#80fae0') },
				uPinkColor: { value: new THREE.Color('#ff80e0') }
			},
			vertexShader,
			fragmentShader,
			depthTest: false
		});

		const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
		scene.add(mesh);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			powerPreference: 'high-performance'
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);
		host.appendChild(renderer.domElement);

		let raf = 0;
		let last = performance.now();

		const resize = () => {
			const w = host.clientWidth;
			const h = host.clientHeight;
			if (w > 0 && h > 0) renderer.setSize(w, h, false);
		};
		const ro = new ResizeObserver(resize);
		ro.observe(host);
		resize();

		const applyPalette = () => {
			const target = container ?? host;
			material.uniforms.uBaseColor.value.copy(
				readCssColor(target, '--header-logo-mark-base', '#171523')
			);
			material.uniforms.uPrimaryColor.value.copy(
				readCssColor(target, '--header-logo-mark-primary', '#6b9eff')
			);
			material.uniforms.uSecondaryColor.value.copy(
				readCssColor(target, '--header-logo-mark-secondary', '#ff856b')
			);
			material.uniforms.uMintColor.value.copy(
				readCssColor(target, '--header-logo-mark-mint', '#80fae0')
			);
			material.uniforms.uPinkColor.value.copy(
				readCssColor(target, '--header-logo-mark-pink', '#ff80e0')
			);
		};

		applyPalette();
		const paletteObserver = new MutationObserver(applyPalette);
		paletteObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class', 'style']
		});

		const loop = (now: number) => {
			raf = requestAnimationFrame(loop);
			const delta = Math.min((now - last) / 1000, 0.1);
			last = now;

			sim.time += delta * ptr.timeScale;

			const mouseDampingFactor = 1 - Math.exp(-delta * CURSOR_DAMPING);
			sim.currentX += (ptr.targetX - sim.currentX) * mouseDampingFactor;
			sim.currentY += (ptr.targetY - sim.currentY) * mouseDampingFactor;

			const movement = Math.hypot(
				ptr.targetX - sim.prevTargetX,
				ptr.targetY - sim.prevTargetY
			);
			sim.prevTargetX = ptr.targetX;
			sim.prevTargetY = ptr.targetY;

			const wakeBoost = ptr.wakeMix > 0 ? movement * 22 * ptr.wakeMix : 0;
			sim.wakeEnergy = Math.min(
				1,
				sim.wakeEnergy * Math.exp(-delta * WAKE_DECAY) + wakeBoost
			);
			sim.zapEnergy *= Math.exp(-delta * ZAP_DECAY);
			if (ptr.zapPending) {
				sim.zapX = ptr.zapX;
				sim.zapY = ptr.zapY;
				sim.zapEnergy = 1;
				ptr.zapPending = false;
			}

			const hoverTarget = ptr.hovering ? 1 : 0;
			const settle = 1 - Math.exp(-delta / SETTLE_MS);
			sim.hoverProgress += (hoverTarget - sim.hoverProgress) * settle;

			material.uniforms.uTime.value = sim.time;
			material.uniforms.uPointer.value.set(sim.currentX, sim.currentY);
			material.uniforms.uWakeEnergy.value = sim.wakeEnergy;
			material.uniforms.uHover.value = sim.hoverProgress;
			material.uniforms.uWakeMix.value = ptr.wakeMix;
			material.uniforms.uZapEnergy.value = sim.zapEnergy;
			material.uniforms.uZapOrigin.value.set(sim.zapX, sim.zapY);
			material.uniforms.uZapMix.value = ptr.zapMix;

			renderer.render(scene, camera);
		};
		raf = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			paletteObserver.disconnect();
			mesh.geometry.dispose();
			material.dispose();
			renderer.dispose();
			if (renderer.domElement.parentNode === host) {
				host.removeChild(renderer.domElement);
			}
		};
	});
</script>

<div
	bind:this={container}
	class="header-logo-mark relative size-9 min-h-9 min-w-9 shrink-0 overflow-hidden rounded-full"
>
	{#if browser && mediaReady && webglOk}
		<div
			bind:this={webglHost}
			class="header-logo-mark__gl pointer-events-none absolute inset-0 z-0"
			role="presentation"
		></div>
	{:else}
		<div
			class="header-logo-mark__static pointer-events-none absolute inset-0 z-0"
			class:header-logo-mark__static--motion={browser && mediaReady && !prefersReducedMotion}
		></div>
	{/if}

	<svg
		class="pointer-events-none relative z-[5] block h-full w-full p-[5px] text-(--text-primary)"
		viewBox="0 0 32 32"
		aria-hidden="true"
	>
		<g
			fill="none"
			stroke="currentColor"
			stroke-width="1.85"
			stroke-linecap="round"
			stroke-linejoin="round"
			opacity="0.94"
		>
			<path d="M6 8v16 M6 8h5 M6 16h4 M6 24h5" />
			<path d="M13 24V8l4.5 8L22 8v16" />
			<path d="M24 8h6 M30 8L24 24 M24 24h5" />
		</g>
	</svg>

	<div
		class="header-logo-mark__hit absolute inset-0 z-10 touch-none"
		aria-hidden="true"
		onpointerenter={handlePointerEnter}
		onpointerleave={handlePointerLeave}
		onpointerdown={handlePointerDown}
		onpointermove={updatePointer}
	></div>
</div>

<style>
	.header-logo-mark {
		background: var(--header-logo-mark-shell);
		box-shadow: inset 0 1px 0 var(--header-logo-mark-shell-highlight);
	}

	.header-logo-mark__gl :global(canvas) {
		display: block;
		width: 100% !important;
		height: 100% !important;
	}

	.header-logo-mark__static {
		background-image: linear-gradient(
			135deg,
			var(--header-logo-mark-static-from),
			var(--header-logo-mark-static-via),
			var(--header-logo-mark-static-to)
		);
	}

	.header-logo-mark__static--motion {
		background-size: 220% 220%;
		animation:
			header-logo-static-drift 12s ease-in-out infinite,
			header-logo-static-breathe 5.5s ease-in-out infinite;
	}

	@keyframes header-logo-static-drift {
		0%,
		100% {
			background-position: 0% 35%;
		}
		50% {
			background-position: 100% 65%;
		}
	}

	@keyframes header-logo-static-breathe {
		0%,
		100% {
			filter: brightness(1) saturate(1);
		}
		50% {
			filter: brightness(1.12) saturate(1.15);
		}
	}
</style>
