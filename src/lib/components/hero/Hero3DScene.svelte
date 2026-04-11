<script lang="ts">
	import { browser } from '$app/environment';
	import { T, useTask } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import paintingBaseImage from '$lib/images/photos/emma-painting-full.jpeg';
	import paintingRevealImage from '$lib/images/photos/emma-painting-full-day.png';
	import {
		defaultHero3DParams,
		type Hero3DCursorShape,
		type Hero3DParams
	} from '$lib/stores/hero3dParams.svelte';
	import * as THREE from 'three';

	interface Props {
		mouseX?: number;
		mouseY?: number;
		isHovering?: boolean;
		sceneParams?: Hero3DParams;
		resetKey?: string;
	}

	let {
		mouseX = 0.5,
		mouseY = 0.5,
		isHovering = false,
		sceneParams = defaultHero3DParams,
		resetKey = ''
	}: Props = $props();

	const textures = useTexture({
		base: paintingBaseImage,
		reveal: paintingRevealImage
	});

	const revealMaskCanvas = browser ? document.createElement('canvas') : null;
	if (revealMaskCanvas) {
		revealMaskCanvas.width = 768;
		revealMaskCanvas.height = 768;
	}

	const revealMaskContext = revealMaskCanvas?.getContext('2d');
	if (revealMaskContext && revealMaskCanvas) {
		revealMaskContext.fillStyle = '#000';
		revealMaskContext.fillRect(0, 0, revealMaskCanvas.width, revealMaskCanvas.height);
	}

	const revealMaskTexture = revealMaskCanvas
		? new THREE.CanvasTexture(revealMaskCanvas)
		: new THREE.Texture();
	revealMaskTexture.minFilter = THREE.NearestFilter;
	revealMaskTexture.magFilter = THREE.NearestFilter;
	revealMaskTexture.wrapS = THREE.ClampToEdgeWrapping;
	revealMaskTexture.wrapT = THREE.ClampToEdgeWrapping;

	let shaderMaterialRef: THREE.ShaderMaterial | null = null;

	const refs = {
		time: 0,
		targetMouse: { x: 0.5, y: 0.5 },
		currentMouse: { x: 0.5, y: 0.5 },
		previousTargetMouse: { x: 0.5, y: 0.5 },
		lastPaintedMouse: { x: 0.5, y: 0.5 },
		hasPaintedMask: false,
		hoverProgress: 0,
		motionEnergy: 0,
		isHovering: false,
		revealRadius: defaultHero3DParams.revealRadius,
		revealSoftness: defaultHero3DParams.revealSoftness,
		revealOpacity: defaultHero3DParams.revealOpacity,
		cursorShape: defaultHero3DParams.cursorShape,
		cursorWidth: defaultHero3DParams.cursorWidth,
		cursorHeight: defaultHero3DParams.cursorHeight,
		pixelSize: defaultHero3DParams.pixelSize,
		pixelHardness: defaultHero3DParams.pixelHardness,
		pixelScatter: defaultHero3DParams.pixelScatter,
		idleReveal: defaultHero3DParams.idleReveal,
		cursorDamping: defaultHero3DParams.cursorDamping,
		revealDamping: defaultHero3DParams.revealDamping,
		parallaxStrength: defaultHero3DParams.parallaxStrength,
		tiltStrength: defaultHero3DParams.tiltStrength,
		liftStrength: defaultHero3DParams.liftStrength,
		rippleStrength: defaultHero3DParams.rippleStrength,
		rippleFrequency: defaultHero3DParams.rippleFrequency,
		rippleSpeed: defaultHero3DParams.rippleSpeed,
		rippleDecay: defaultHero3DParams.rippleDecay,
		bounceStrength: defaultHero3DParams.bounceStrength,
		bounceFrequency: defaultHero3DParams.bounceFrequency,
		bounceDecay: defaultHero3DParams.bounceDecay,
		fadeStrength: defaultHero3DParams.fadeStrength,
		fadeSoftness: defaultHero3DParams.fadeSoftness,
		glowStrength: defaultHero3DParams.glowStrength,
		glowRadius: defaultHero3DParams.glowRadius,
		revealBrightness: defaultHero3DParams.revealBrightness,
		revealContrast: defaultHero3DParams.revealContrast,
		chromaStrength: defaultHero3DParams.chromaStrength,
		grainStrength: defaultHero3DParams.grainStrength,
		grainScale: defaultHero3DParams.grainScale
	};

	function toMaskCoordinates(point: { x: number; y: number }) {
		if (!revealMaskCanvas) return { x: 0, y: 0 };

		return {
			x: point.x * revealMaskCanvas.width,
			y: (1 - point.y) * revealMaskCanvas.height
		};
	}

	function snapToPixelGrid(value: number, size: number) {
		return Math.round(value / size) * size;
	}

	function clearRevealMask() {
		if (!revealMaskContext || !revealMaskCanvas) return;

		revealMaskContext.clearRect(0, 0, revealMaskCanvas.width, revealMaskCanvas.height);
		revealMaskContext.fillStyle = '#000';
		revealMaskContext.fillRect(0, 0, revealMaskCanvas.width, revealMaskCanvas.height);
		revealMaskTexture.needsUpdate = true;
	}

	function resetSceneState() {
		clearRevealMask();
		refs.hoverProgress = 0;
		refs.motionEnergy = 0;
		refs.hasPaintedMask = false;
		refs.currentMouse.x = 0.5;
		refs.currentMouse.y = 0.5;
		refs.targetMouse.x = 0.5;
		refs.targetMouse.y = 0.5;
		refs.previousTargetMouse.x = 0.5;
		refs.previousTargetMouse.y = 0.5;
		refs.lastPaintedMouse.x = 0.5;
		refs.lastPaintedMouse.y = 0.5;
	}

	function stampBrushShape(
		centerX: number,
		centerY: number,
		brushWidth: number,
		brushHeight: number,
		softness: number,
		hardness: number,
		cursorShape: Hero3DCursorShape
	) {
		if (!revealMaskContext || !revealMaskCanvas) return;

		const halfWidth = brushWidth * 0.5;
		const halfHeight = brushHeight * 0.5;

		revealMaskContext.save();
		revealMaskContext.globalCompositeOperation = 'source-over';
		revealMaskContext.fillStyle = 'rgba(255,255,255,1)';
		revealMaskContext.shadowBlur = softness * (1 - hardness) * 0.8;
		revealMaskContext.shadowColor = 'rgba(255,255,255,0.9)';
		if (cursorShape === 'circle') {
			revealMaskContext.beginPath();
			revealMaskContext.ellipse(centerX, centerY, halfWidth, halfHeight, 0, 0, Math.PI * 2);
			revealMaskContext.fill();
		} else {
			revealMaskContext.fillRect(centerX - halfWidth, centerY - halfHeight, brushWidth, brushHeight);
		}
		revealMaskContext.restore();
	}

	function paintRevealMask(from: { x: number; y: number }, to: { x: number; y: number }) {
		if (!revealMaskContext || !revealMaskCanvas) return;

		const fromPoint = toMaskCoordinates(from);
		const toPoint = toMaskCoordinates(to);
		const pixelScale = THREE.MathUtils.clamp(refs.pixelSize, 0, 1);
		const hardness = THREE.MathUtils.clamp(refs.pixelHardness, 0, 1);
		const cursorShape = refs.cursorShape;
		const brushBaseSize = Math.max(
			6,
			Math.round(
				THREE.MathUtils.lerp(8, 34, pixelScale)
					* THREE.MathUtils.lerp(
						0.8,
						1.1,
						THREE.MathUtils.clamp(refs.revealRadius / 0.45, 0, 1)
					)
			)
		);
		const widthScale = THREE.MathUtils.clamp(refs.cursorWidth, 0.25, 2);
		const heightScale = THREE.MathUtils.clamp(refs.cursorHeight, 0.25, 2);
		const brushWidth = Math.max(4, Math.round(brushBaseSize * widthScale));
		const brushHeight = Math.max(4, Math.round(brushBaseSize * heightScale));
		const softness = THREE.MathUtils.lerp(
			0.2,
			3.2,
			THREE.MathUtils.clamp((1 - hardness) * 0.8 + refs.revealSoftness * 0.6, 0, 1)
		);
		const deltaX = toPoint.x - fromPoint.x;
		const deltaY = toPoint.y - fromPoint.y;
		const distance = Math.hypot(deltaX, deltaY);
		const spacing = Math.max(
			1,
			Math.max(brushWidth, brushHeight) * THREE.MathUtils.lerp(0.75, 0.36, refs.pixelScatter)
		);
		const steps = Math.max(1, Math.ceil(distance / spacing));
		const scatterOffsets = [
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1],
			[1, 1],
			[-1, 1],
			[1, -1],
			[-1, -1]
		] as const;

		for (let step = 0; step <= steps; step += 1) {
			const progress = step / steps;
			const x = fromPoint.x + deltaX * progress;
			const y = fromPoint.y + deltaY * progress;
			const paintX = cursorShape === 'square' ? snapToPixelGrid(x, brushWidth) : x;
			const paintY = cursorShape === 'square' ? snapToPixelGrid(y, brushHeight) : y;

			stampBrushShape(paintX, paintY, brushWidth, brushHeight, softness, hardness, cursorShape);

			const burstCount = Math.min(3, Math.round(refs.pixelScatter * 3));
			for (let burst = 0; burst < burstCount; burst += 1) {
				const [offsetX, offsetY] = scatterOffsets[(step + burst) % scatterOffsets.length];
				stampBrushShape(
					paintX + offsetX * brushWidth,
					paintY + offsetY * brushHeight,
					brushWidth,
					brushHeight,
					softness * 0.5,
					hardness,
					cursorShape
				);
			}
		}

		revealMaskTexture.needsUpdate = true;
	}

	$effect(() => {
		refs.targetMouse.x = mouseX;
		refs.targetMouse.y = mouseY;
		refs.isHovering = isHovering;
		refs.revealRadius = sceneParams.revealRadius;
		refs.revealSoftness = sceneParams.revealSoftness;
		refs.revealOpacity = sceneParams.revealOpacity;
		refs.cursorShape = sceneParams.cursorShape;
		refs.cursorWidth = sceneParams.cursorWidth;
		refs.cursorHeight = sceneParams.cursorHeight;
		refs.pixelSize = sceneParams.pixelSize;
		refs.pixelHardness = sceneParams.pixelHardness;
		refs.pixelScatter = sceneParams.pixelScatter;
		refs.idleReveal = sceneParams.idleReveal;
		refs.cursorDamping = sceneParams.cursorDamping;
		refs.revealDamping = sceneParams.revealDamping;
		refs.parallaxStrength = sceneParams.parallaxStrength;
		refs.tiltStrength = sceneParams.tiltStrength;
		refs.liftStrength = sceneParams.liftStrength;
		refs.rippleStrength = sceneParams.rippleStrength;
		refs.rippleFrequency = sceneParams.rippleFrequency;
		refs.rippleSpeed = sceneParams.rippleSpeed;
		refs.rippleDecay = sceneParams.rippleDecay;
		refs.bounceStrength = sceneParams.bounceStrength;
		refs.bounceFrequency = sceneParams.bounceFrequency;
		refs.bounceDecay = sceneParams.bounceDecay;
		refs.fadeStrength = sceneParams.fadeStrength;
		refs.fadeSoftness = sceneParams.fadeSoftness;
		refs.glowStrength = sceneParams.glowStrength;
		refs.glowRadius = sceneParams.glowRadius;
		refs.revealBrightness = sceneParams.revealBrightness;
		refs.revealContrast = sceneParams.revealContrast;
		refs.chromaStrength = sceneParams.chromaStrength;
		refs.grainStrength = sceneParams.grainStrength;
		refs.grainScale = sceneParams.grainScale;
	});

	$effect(() => {
		resetKey;
		resetSceneState();
	});

	useTask((delta) => {
		refs.time += delta;
		const mouseDampingFactor = 1 - Math.exp(-delta * refs.cursorDamping);
		const revealDampingFactor = 1 - Math.exp(-delta * refs.revealDamping);

		refs.currentMouse.x += (refs.targetMouse.x - refs.currentMouse.x) * mouseDampingFactor;
		refs.currentMouse.y += (refs.targetMouse.y - refs.currentMouse.y) * mouseDampingFactor;

		const movement = Math.hypot(
			refs.targetMouse.x - refs.previousTargetMouse.x,
			refs.targetMouse.y - refs.previousTargetMouse.y
		);
		refs.previousTargetMouse.x = refs.targetMouse.x;
		refs.previousTargetMouse.y = refs.targetMouse.y;
		refs.motionEnergy = Math.min(
			1,
			refs.motionEnergy * Math.exp(-delta * refs.bounceDecay) + movement * 12
		);

		const targetProgress = refs.isHovering ? 1 : 0;
		refs.hoverProgress += (targetProgress - refs.hoverProgress) * revealDampingFactor;

		if (refs.isHovering) {
			paintRevealMask(
				refs.hasPaintedMask ? refs.lastPaintedMouse : refs.currentMouse,
				refs.currentMouse
			);
			refs.lastPaintedMouse.x = refs.currentMouse.x;
			refs.lastPaintedMouse.y = refs.currentMouse.y;
			refs.hasPaintedMask = true;
		} else {
			refs.hasPaintedMask = false;
		}

		if (!shaderMaterialRef) return;

		shaderMaterialRef.uniforms.uTime.value = refs.time;
		shaderMaterialRef.uniforms.uMouse.value.set(refs.currentMouse.x, refs.currentMouse.y);
		shaderMaterialRef.uniforms.uHoverProgress.value = refs.hoverProgress;
		shaderMaterialRef.uniforms.uMotionEnergy.value = refs.motionEnergy;
		shaderMaterialRef.uniforms.uRevealRadius.value = refs.revealRadius;
		shaderMaterialRef.uniforms.uRevealSoftness.value = refs.revealSoftness;
		shaderMaterialRef.uniforms.uRevealOpacity.value = refs.revealOpacity;
		shaderMaterialRef.uniforms.uCursorShapeMix.value = refs.cursorShape === 'square' ? 1 : 0;
		shaderMaterialRef.uniforms.uCursorScale.value.set(refs.cursorWidth, refs.cursorHeight);
		shaderMaterialRef.uniforms.uPixelSize.value = refs.pixelSize;
		shaderMaterialRef.uniforms.uPixelHardness.value = refs.pixelHardness;
		shaderMaterialRef.uniforms.uIdleReveal.value = refs.idleReveal;
		shaderMaterialRef.uniforms.uParallaxStrength.value = refs.parallaxStrength;
		shaderMaterialRef.uniforms.uTiltStrength.value = refs.tiltStrength;
		shaderMaterialRef.uniforms.uLiftStrength.value = refs.liftStrength;
		shaderMaterialRef.uniforms.uRippleStrength.value = refs.rippleStrength;
		shaderMaterialRef.uniforms.uRippleFrequency.value = refs.rippleFrequency;
		shaderMaterialRef.uniforms.uRippleSpeed.value = refs.rippleSpeed;
		shaderMaterialRef.uniforms.uRippleDecay.value = refs.rippleDecay;
		shaderMaterialRef.uniforms.uBounceStrength.value = refs.bounceStrength;
		shaderMaterialRef.uniforms.uBounceFrequency.value = refs.bounceFrequency;
		shaderMaterialRef.uniforms.uFadeStrength.value = refs.fadeStrength;
		shaderMaterialRef.uniforms.uFadeSoftness.value = refs.fadeSoftness;
		shaderMaterialRef.uniforms.uGlowStrength.value = refs.glowStrength;
		shaderMaterialRef.uniforms.uGlowRadius.value = refs.glowRadius;
		shaderMaterialRef.uniforms.uRevealBrightness.value = refs.revealBrightness;
		shaderMaterialRef.uniforms.uRevealContrast.value = refs.revealContrast;
		shaderMaterialRef.uniforms.uChromaStrength.value = refs.chromaStrength;
		shaderMaterialRef.uniforms.uGrainStrength.value = refs.grainStrength;
		shaderMaterialRef.uniforms.uGrainScale.value = refs.grainScale;
	});

	const imageAspect = 1;
	const containerAspect = 1.78;
	const vScale = imageAspect / containerAspect;
	const focusY = 0.52;
	const vOffset = focusY - vScale / 2;

	function createShaderMaterial(textures: {
		base: THREE.Texture;
		reveal: THREE.Texture;
	}): THREE.ShaderMaterial {
		textures.base.colorSpace = THREE.SRGBColorSpace;
		textures.base.minFilter = THREE.LinearFilter;
		textures.base.magFilter = THREE.LinearFilter;
		textures.reveal.colorSpace = THREE.SRGBColorSpace;
		textures.reveal.minFilter = THREE.LinearFilter;
		textures.reveal.magFilter = THREE.LinearFilter;

		const material = new THREE.ShaderMaterial({
			uniforms: {
				uBaseTexture: { value: textures.base },
				uRevealTexture: { value: textures.reveal },
				uRevealMaskTexture: { value: revealMaskTexture },
				uMouse: { value: new THREE.Vector2(0.5, 0.5) },
				uHoverProgress: { value: 0 },
				uMotionEnergy: { value: 0 },
				uTime: { value: 0 },
				uRevealRadius: { value: sceneParams.revealRadius },
				uRevealSoftness: { value: sceneParams.revealSoftness },
				uRevealOpacity: { value: sceneParams.revealOpacity },
				uCursorShapeMix: { value: sceneParams.cursorShape === 'square' ? 1 : 0 },
				uCursorScale: { value: new THREE.Vector2(sceneParams.cursorWidth, sceneParams.cursorHeight) },
				uPixelSize: { value: sceneParams.pixelSize },
				uPixelHardness: { value: sceneParams.pixelHardness },
				uIdleReveal: { value: sceneParams.idleReveal },
				uParallaxStrength: { value: sceneParams.parallaxStrength },
				uTiltStrength: { value: sceneParams.tiltStrength },
				uLiftStrength: { value: sceneParams.liftStrength },
				uRippleStrength: { value: sceneParams.rippleStrength },
				uRippleFrequency: { value: sceneParams.rippleFrequency },
				uRippleSpeed: { value: sceneParams.rippleSpeed },
				uRippleDecay: { value: sceneParams.rippleDecay },
				uBounceStrength: { value: sceneParams.bounceStrength },
				uBounceFrequency: { value: sceneParams.bounceFrequency },
				uFadeStrength: { value: sceneParams.fadeStrength },
				uFadeSoftness: { value: sceneParams.fadeSoftness },
				uGlowStrength: { value: sceneParams.glowStrength },
				uGlowRadius: { value: sceneParams.glowRadius },
				uRevealBrightness: { value: sceneParams.revealBrightness },
				uRevealContrast: { value: sceneParams.revealContrast },
				uChromaStrength: { value: sceneParams.chromaStrength },
				uGrainStrength: { value: sceneParams.grainStrength },
				uGrainScale: { value: sceneParams.grainScale },
				uVScale: { value: vScale },
				uVOffset: { value: vOffset }
			},
			vertexShader,
			fragmentShader,
			transparent: true,
			side: THREE.DoubleSide
		});

		shaderMaterialRef = material;
		return material;
	}

	const vertexShader = `
		uniform vec2 uMouse;
		uniform float uHoverProgress;
		uniform float uMotionEnergy;
		uniform float uTiltStrength;
		uniform float uLiftStrength;
		uniform float uVScale;
		uniform float uVOffset;

		varying vec2 vUv;
		varying vec2 vRawUv;
		varying float vLift;

		void main() {
			vRawUv = uv;
			vUv = vec2(uv.x, uv.y * uVScale + uVOffset);
			vec2 centered = uv - 0.5;
			vec2 mouseOffset = uMouse - 0.5;
			float cursorLift = exp(-distance(uv, uMouse) * 8.0) * uLiftStrength;
			float hoverLift = cursorLift
				* (0.4 + 0.6 * uHoverProgress)
				* (1.0 + uMotionEnergy * 0.35);
			vec3 displaced = position;
			displaced.x += centered.y * mouseOffset.x * uTiltStrength * 0.28;
			displaced.y += centered.x * mouseOffset.y * uTiltStrength * 0.22;
			displaced.z += hoverLift;
			vLift = hoverLift;

			gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
		}
	`;

	const fragmentShader = `
		uniform sampler2D uBaseTexture;
		uniform sampler2D uRevealTexture;
		uniform sampler2D uRevealMaskTexture;
		uniform vec2 uMouse;
		uniform float uHoverProgress;
		uniform float uMotionEnergy;
		uniform float uTime;
		uniform float uRevealRadius;
		uniform float uRevealSoftness;
		uniform float uRevealOpacity;
		uniform float uCursorShapeMix;
		uniform vec2 uCursorScale;
		uniform float uPixelSize;
		uniform float uPixelHardness;
		uniform float uIdleReveal;
		uniform float uParallaxStrength;
		uniform float uTiltStrength;
		uniform float uRippleStrength;
		uniform float uRippleFrequency;
		uniform float uRippleSpeed;
		uniform float uRippleDecay;
		uniform float uBounceStrength;
		uniform float uBounceFrequency;
		uniform float uFadeStrength;
		uniform float uFadeSoftness;
		uniform float uGlowStrength;
		uniform float uGlowRadius;
		uniform float uRevealBrightness;
		uniform float uRevealContrast;
		uniform float uChromaStrength;
		uniform float uGrainStrength;
		uniform float uGrainScale;

		varying vec2 vUv;
		varying vec2 vRawUv;
		varying float vLift;

		float hash(vec2 point) {
			return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
		}

		float noise(vec2 point) {
			vec2 cell = floor(point);
			vec2 local = fract(point);
			vec2 smoothLocal = local * local * (3.0 - 2.0 * local);
			return mix(
				mix(hash(cell), hash(cell + vec2(1.0, 0.0)), smoothLocal.x),
				mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), smoothLocal.x),
				smoothLocal.y
			);
		}

		void main() {
			vec2 sampleUv = clamp(vUv, vec2(0.001), vec2(0.999));
			vec2 mouseOffset = uMouse - 0.5;
			vec2 centeredUv = vRawUv - 0.5;
			float effectPresence = clamp(max(mix(uIdleReveal, 1.0, uHoverProgress), uMotionEnergy * 0.5), 0.0, 1.0);
			vec2 parallaxOffset = mouseOffset * uParallaxStrength * (0.25 + effectPresence * 0.75);
			vec2 tiltOffset = vec2(centeredUv.y * mouseOffset.x, centeredUv.x * mouseOffset.y)
				* uTiltStrength
				* 0.16;

			vec2 baseUv = clamp(sampleUv + parallaxOffset * 0.2 + tiltOffset * 0.35, vec2(0.001), vec2(0.999));
			vec2 revealBaseUv = clamp(
				sampleUv - parallaxOffset * 0.85 - tiltOffset * 0.75,
				vec2(0.001),
				vec2(0.999)
			);

			vec2 toMouse = vRawUv - uMouse;
			float dist = length(toMouse);
			float visibility = mix(uIdleReveal, 1.0, uHoverProgress);
			vec2 cursorScale = max(vec2(0.25), vec2(
				clamp(uCursorScale.x, 0.25, 2.0),
				clamp(uCursorScale.y, 0.25, 2.0)
			));
			vec2 shapedMouse = toMouse / cursorScale;
			float circleDist = length(shapedMouse);
			float squareDist = max(abs(shapedMouse.x), abs(shapedMouse.y));
			float shapeDist = mix(circleDist, squareDist, clamp(uCursorShapeMix, 0.0, 1.0));
			float rippleEnvelope = exp(-dist * max(0.15, uRippleDecay) * 8.0);
			float rippleWave = sin(
				dist * (8.0 + uRippleFrequency * 28.0) - uTime * (1.5 + uRippleSpeed * 6.0)
			);
			float ripple = rippleWave
				* uRippleStrength
				* 0.035
				* rippleEnvelope
				* visibility
				* (0.45 + 0.55 * uMotionEnergy);
			float bounce = sin(uTime * (2.0 + uBounceFrequency * 10.0))
				* uMotionEnergy
				* uBounceStrength
				* 0.05;
			float revealRadius = max(0.001, (uRevealRadius + bounce) * mix(0.22, 1.0, uPixelSize));
			float hardness = clamp(uPixelHardness, 0.0, 1.0);
			float revealSoftness = max(
				0.0008,
				mix(0.0025, 0.045, 1.0 - hardness) + uRevealSoftness * (0.03 + (1.0 - hardness) * 0.24)
			);
			float brushDistance = shapeDist + ripple * mix(0.02, 0.12, 1.0 - hardness);
			float brushMask = 1.0 - smoothstep(
				revealRadius,
				revealRadius + revealSoftness,
				brushDistance
			);
			float fade = pow(
				clamp(1.0 - brushDistance / (revealRadius + revealSoftness + 0.0001), 0.0, 1.0),
				mix(0.7, 4.0, uFadeSoftness)
			);
			float liveMask = mix(brushMask, brushMask * fade, uFadeStrength) * visibility;
			float trailMask = smoothstep(0.45, 0.85, texture2D(uRevealMaskTexture, vRawUv).r);
			float mask = max(trailMask, liveMask);
			float revealMix = mask * uRevealOpacity;
			float edgeGlow = smoothstep(
				revealRadius + uGlowRadius + revealSoftness,
				revealRadius,
				brushDistance
			)
				* (1.0 - brushMask * 0.88)
				* uGlowStrength
				* visibility;
			edgeGlow *= 0.16;
			edgeGlow += max(0.0, trailMask - 0.9) * uGlowStrength * 0.03;
			float pixelOutline = smoothstep(
				revealRadius + revealSoftness * mix(0.08, 0.2, 1.0 - hardness),
				revealRadius,
				brushDistance
			) * (1.0 - smoothstep(
				max(0.0, revealRadius - revealSoftness * mix(0.22, 0.42, 1.0 - hardness)),
				revealRadius - revealSoftness * mix(0.03, 0.08, 1.0 - hardness),
				brushDistance
			));

			vec2 chromaDir = normalize(toMouse + vec2(0.0001, 0.0001));
			vec2 chromaOffset = chromaDir * uChromaStrength * 0.01 * (0.25 + edgeGlow);
			vec4 baseColor = texture2D(uBaseTexture, baseUv);
			vec2 revealUvR = clamp(revealBaseUv + chromaOffset, vec2(0.001), vec2(0.999));
			vec2 revealUvB = clamp(revealBaseUv - chromaOffset, vec2(0.001), vec2(0.999));
			vec3 revealColor = vec3(
				texture2D(uRevealTexture, revealUvR).r,
				texture2D(uRevealTexture, revealBaseUv).g,
				texture2D(uRevealTexture, revealUvB).b
			);
			float revealPop = smoothstep(0.12, 0.9, mask);
			float revealLuma = dot(revealColor, vec3(0.299, 0.587, 0.114));
			vec3 boostedRevealColor = revealColor * (1.08 + revealPop * 0.38);
			boostedRevealColor = mix(vec3(revealLuma), boostedRevealColor, 1.12 + revealPop * 0.18);
			boostedRevealColor += vec3(0.1, 0.12, 0.16) * revealPop * 0.12;
			boostedRevealColor *= max(0.0, uRevealBrightness);
			boostedRevealColor = (boostedRevealColor - 0.5) * max(0.0, uRevealContrast) + 0.5;
			boostedRevealColor = clamp(boostedRevealColor, 0.0, 1.0);

			vec3 rgb = mix(baseColor.rgb, boostedRevealColor, revealMix);
			rgb += edgeGlow * vec3(1.0, 0.82, 0.62) * (0.18 + revealPop * 0.08);
			rgb += pixelOutline * visibility * vec3(1.0, 0.97, 0.9) * (0.16 + uGlowStrength * 0.12);
			rgb += mask * visibility * (0.08 + vLift * 0.9) * vec3(0.14, 0.08, 0.06);

			float grain = noise(sampleUv * uGrainScale + vec2(uTime * 18.0, -uTime * 12.0));
			rgb += (grain - 0.5) * uGrainStrength * 0.08 * (0.3 + revealMix * 0.7);
			rgb = clamp(rgb, 0.0, 1.0);

			gl_FragColor = vec4(rgb, baseColor.a);
		}
	`;
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 2.5]} fov={45} near={0.01} far={100} />

<T.AmbientLight intensity={1} />

{#if $textures}
	<T.Mesh position={[0, 0, 0]}>
		<T.PlaneGeometry args={[4.5, 2.3, 64, 36]} />
		<T is={createShaderMaterial($textures)} />
	</T.Mesh>
{:else}
	<T.Mesh position={[0, 0, 0]}>
		<T.PlaneGeometry args={[4.5, 2.3, 1, 1]} />
		<T.MeshBasicMaterial color="#170b17" side={THREE.DoubleSide} />
	</T.Mesh>
{/if}
