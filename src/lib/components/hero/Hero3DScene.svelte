<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import paintingBaseImage from '$lib/images/photos/emma-painting-full.jpeg';
	import paintingRevealImage from '$lib/images/photos/emma-painting-full-day.png';
	import {
		defaultHero3DParams,
		type Hero3DParams
	} from '$lib/stores/hero3dParams.svelte';
	import * as THREE from 'three';

	interface Props {
		mouseX?: number;
		mouseY?: number;
		isHovering?: boolean;
		sceneParams?: Hero3DParams;
	}

	let { mouseX = 0.5, mouseY = 0.5, isHovering = false, sceneParams = defaultHero3DParams }: Props =
		$props();

	const textures = useTexture({
		base: paintingBaseImage,
		reveal: paintingRevealImage
	});

	let shaderMaterialRef: THREE.ShaderMaterial | null = null;

	const refs = {
		time: 0,
		targetMouse: { x: 0.5, y: 0.5 },
		currentMouse: { x: 0.5, y: 0.5 },
		previousTargetMouse: { x: 0.5, y: 0.5 },
		hoverProgress: 0,
		motionEnergy: 0,
		isHovering: false,
		revealRadius: defaultHero3DParams.revealRadius,
		revealSoftness: defaultHero3DParams.revealSoftness,
		revealOpacity: defaultHero3DParams.revealOpacity,
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
		chromaStrength: defaultHero3DParams.chromaStrength,
		grainStrength: defaultHero3DParams.grainStrength,
		grainScale: defaultHero3DParams.grainScale
	};

	$effect(() => {
		refs.targetMouse.x = mouseX;
		refs.targetMouse.y = mouseY;
		refs.isHovering = isHovering;
		refs.revealRadius = sceneParams.revealRadius;
		refs.revealSoftness = sceneParams.revealSoftness;
		refs.revealOpacity = sceneParams.revealOpacity;
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
		refs.chromaStrength = sceneParams.chromaStrength;
		refs.grainStrength = sceneParams.grainStrength;
		refs.grainScale = sceneParams.grainScale;
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

		if (!shaderMaterialRef) return;

		shaderMaterialRef.uniforms.uTime.value = refs.time;
		shaderMaterialRef.uniforms.uMouse.value.set(refs.currentMouse.x, refs.currentMouse.y);
		shaderMaterialRef.uniforms.uHoverProgress.value = refs.hoverProgress;
		shaderMaterialRef.uniforms.uMotionEnergy.value = refs.motionEnergy;
		shaderMaterialRef.uniforms.uRevealRadius.value = refs.revealRadius;
		shaderMaterialRef.uniforms.uRevealSoftness.value = refs.revealSoftness;
		shaderMaterialRef.uniforms.uRevealOpacity.value = refs.revealOpacity;
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
				uMouse: { value: new THREE.Vector2(0.5, 0.5) },
				uHoverProgress: { value: 0 },
				uMotionEnergy: { value: 0 },
				uTime: { value: 0 },
				uRevealRadius: { value: sceneParams.revealRadius },
				uRevealSoftness: { value: sceneParams.revealSoftness },
				uRevealOpacity: { value: sceneParams.revealOpacity },
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
		uniform vec2 uMouse;
		uniform float uHoverProgress;
		uniform float uMotionEnergy;
		uniform float uTime;
		uniform float uRevealRadius;
		uniform float uRevealSoftness;
		uniform float uRevealOpacity;
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
			float revealRadius = max(0.001, uRevealRadius + bounce);
			float revealSoftness = max(0.001, uRevealSoftness + abs(ripple) * 0.45);
			float mask = 1.0 - smoothstep(revealRadius, revealRadius + revealSoftness, dist + ripple);
			float fade = pow(
				clamp(1.0 - dist / (revealRadius + revealSoftness + 0.0001), 0.0, 1.0),
				mix(0.7, 4.0, uFadeSoftness)
			);
			float revealMix = mix(mask, mask * fade, uFadeStrength) * visibility * uRevealOpacity;
			float edgeGlow = smoothstep(revealRadius + uGlowRadius + revealSoftness, revealRadius, dist)
				* (1.0 - mask * 0.88)
				* uGlowStrength
				* visibility;

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

			vec3 rgb = mix(baseColor.rgb, revealColor, revealMix);
			rgb += edgeGlow * vec3(1.0, 0.62, 0.42);
			rgb += mask * visibility * (0.05 + vLift * 0.7) * vec3(0.09, 0.04, 0.03);

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
