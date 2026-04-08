<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import paintingImage from '$lib/images/photos/emma-painting.jpeg';
	import { defaultHero3DParams } from '$lib/stores/hero3dParams.svelte';
	import * as THREE from 'three';

	interface Props {
		mouseX?: number;
		mouseY?: number;
		isHovering?: boolean;
		depthScale?: number;
		revealRadius?: number;
		parallaxXY?: number;
		parallaxZ?: number;
		splatStretch?: number;
		splatCompress?: number;
		depthBulge?: number;
		contourOffset?: number;
		blobAmplitude?: number;
		noiseAmplitude?: number;
		contourInfluence?: number;
		edgeSoftness?: number;
		saturationBoost?: number;
		contrastBoost?: number;
		rippleSpeed?: number;
		rippleFrequency?: number;
		rippleAmplitude?: number;
		causticScale?: number;
		causticSpeed?: number;
		causticIntensity?: number;
		waterDistortion?: number;
		mouseDamping?: number;
		revealDamping?: number;
		mouseRangeX?: number;
		mouseRangeY?: number;
		depthFocusNear?: number;
		depthFocusFar?: number;
		depthMixLow?: number;
		parallaxXGain?: number;
		parallaxYGain?: number;
		rippleEdgeInfluence?: number;
		edgeRippleStrength?: number;
	}

	let {
		mouseX = 0.5,
		mouseY = 0.5,
		isHovering = false,
		depthScale = defaultHero3DParams.depthScale,
		revealRadius = defaultHero3DParams.revealRadius,
		parallaxXY = defaultHero3DParams.parallaxXY,
		parallaxZ = defaultHero3DParams.parallaxZ,
		splatStretch = defaultHero3DParams.splatStretch,
		splatCompress = defaultHero3DParams.splatCompress,
		depthBulge = defaultHero3DParams.depthBulge,
		contourOffset = defaultHero3DParams.contourOffset,
		blobAmplitude = defaultHero3DParams.blobAmplitude,
		noiseAmplitude = defaultHero3DParams.noiseAmplitude,
		contourInfluence = defaultHero3DParams.contourInfluence,
		edgeSoftness = defaultHero3DParams.edgeSoftness,
		saturationBoost = defaultHero3DParams.saturationBoost,
		contrastBoost = defaultHero3DParams.contrastBoost,
		rippleSpeed = defaultHero3DParams.rippleSpeed,
		rippleFrequency = defaultHero3DParams.rippleFrequency,
		rippleAmplitude = defaultHero3DParams.rippleAmplitude,
		causticScale = defaultHero3DParams.causticScale,
		causticSpeed = defaultHero3DParams.causticSpeed,
		causticIntensity = defaultHero3DParams.causticIntensity,
		waterDistortion = defaultHero3DParams.waterDistortion,
		mouseDamping = defaultHero3DParams.mouseDamping,
		revealDamping = defaultHero3DParams.revealDamping,
		mouseRangeX = defaultHero3DParams.mouseRangeX,
		mouseRangeY = defaultHero3DParams.mouseRangeY,
		depthFocusNear = defaultHero3DParams.depthFocusNear,
		depthFocusFar = defaultHero3DParams.depthFocusFar,
		depthMixLow = defaultHero3DParams.depthMixLow,
		parallaxXGain = defaultHero3DParams.parallaxXGain,
		parallaxYGain = defaultHero3DParams.parallaxYGain,
		rippleEdgeInfluence = defaultHero3DParams.rippleEdgeInfluence,
		edgeRippleStrength = defaultHero3DParams.edgeRippleStrength
	}: Props = $props();

	const textures = useTexture({
		portrait: paintingImage
	});

	let shaderMaterialRef: THREE.ShaderMaterial | null = null;

	const refs = {
		time: 0,
		targetMouse: { x: 0.5, y: 0.5 },
		currentMouse: { x: 0.5, y: 0.5 },
		revealProgress: 0,
		isHovering: false,
		depthScale: defaultHero3DParams.depthScale,
		revealRadius: defaultHero3DParams.revealRadius,
		parallaxXY: defaultHero3DParams.parallaxXY,
		parallaxZ: defaultHero3DParams.parallaxZ,
		splatStretch: defaultHero3DParams.splatStretch,
		splatCompress: defaultHero3DParams.splatCompress,
		depthBulge: defaultHero3DParams.depthBulge,
		contourOffset: defaultHero3DParams.contourOffset,
		blobAmplitude: defaultHero3DParams.blobAmplitude,
		noiseAmplitude: defaultHero3DParams.noiseAmplitude,
		contourInfluence: defaultHero3DParams.contourInfluence,
		edgeSoftness: defaultHero3DParams.edgeSoftness,
		saturationBoost: defaultHero3DParams.saturationBoost,
		contrastBoost: defaultHero3DParams.contrastBoost,
		rippleSpeed: defaultHero3DParams.rippleSpeed,
		rippleFrequency: defaultHero3DParams.rippleFrequency,
		rippleAmplitude: defaultHero3DParams.rippleAmplitude,
		causticScale: defaultHero3DParams.causticScale,
		causticSpeed: defaultHero3DParams.causticSpeed,
		causticIntensity: defaultHero3DParams.causticIntensity,
		waterDistortion: defaultHero3DParams.waterDistortion,
		mouseDamping: defaultHero3DParams.mouseDamping,
		revealDamping: defaultHero3DParams.revealDamping,
		mouseRangeX: defaultHero3DParams.mouseRangeX,
		mouseRangeY: defaultHero3DParams.mouseRangeY,
		depthFocusNear: defaultHero3DParams.depthFocusNear,
		depthFocusFar: defaultHero3DParams.depthFocusFar,
		depthMixLow: defaultHero3DParams.depthMixLow,
		parallaxXGain: defaultHero3DParams.parallaxXGain,
		parallaxYGain: defaultHero3DParams.parallaxYGain,
		rippleEdgeInfluence: defaultHero3DParams.rippleEdgeInfluence,
		edgeRippleStrength: defaultHero3DParams.edgeRippleStrength
	};

	$effect(() => {
		refs.targetMouse.x = mouseX;
		refs.targetMouse.y = mouseY;
		refs.isHovering = isHovering;
	});

	$effect(() => {
		refs.depthScale = depthScale;
		refs.revealRadius = revealRadius;
		refs.parallaxXY = parallaxXY;
		refs.parallaxZ = parallaxZ;
		refs.splatStretch = splatStretch;
		refs.splatCompress = splatCompress;
		refs.depthBulge = depthBulge;
		refs.contourOffset = contourOffset;
		refs.blobAmplitude = blobAmplitude;
		refs.noiseAmplitude = noiseAmplitude;
		refs.contourInfluence = contourInfluence;
		refs.edgeSoftness = edgeSoftness;
		refs.saturationBoost = saturationBoost;
		refs.contrastBoost = contrastBoost;
		refs.rippleSpeed = rippleSpeed;
		refs.rippleFrequency = rippleFrequency;
		refs.rippleAmplitude = rippleAmplitude;
		refs.causticScale = causticScale;
		refs.causticSpeed = causticSpeed;
		refs.causticIntensity = causticIntensity;
		refs.waterDistortion = waterDistortion;
		refs.mouseDamping = mouseDamping;
		refs.revealDamping = revealDamping;
		refs.mouseRangeX = mouseRangeX;
		refs.mouseRangeY = mouseRangeY;
		refs.depthFocusNear = depthFocusNear;
		refs.depthFocusFar = depthFocusFar;
		refs.depthMixLow = depthMixLow;
		refs.parallaxXGain = parallaxXGain;
		refs.parallaxYGain = parallaxYGain;
		refs.rippleEdgeInfluence = rippleEdgeInfluence;
		refs.edgeRippleStrength = edgeRippleStrength;
	});

	useTask((delta) => {
		refs.time += delta;
		const mouseDampingFactor = 1 - Math.exp(-delta * refs.mouseDamping);
		const revealDampingFactor = 1 - Math.exp(-delta * refs.revealDamping);

		refs.currentMouse.x += (refs.targetMouse.x - refs.currentMouse.x) * mouseDampingFactor;
		refs.currentMouse.y += (refs.targetMouse.y - refs.currentMouse.y) * mouseDampingFactor;

		const targetProgress = refs.isHovering ? 1 : 0;
		refs.revealProgress += (targetProgress - refs.revealProgress) * revealDampingFactor;

		if (!shaderMaterialRef) return;

		shaderMaterialRef.uniforms.uTime.value = refs.time;
		shaderMaterialRef.uniforms.uMouse.value.set(refs.currentMouse.x, refs.currentMouse.y);
		shaderMaterialRef.uniforms.uProgress.value = refs.revealProgress;
		shaderMaterialRef.uniforms.uDepthScale.value = refs.depthScale;
		shaderMaterialRef.uniforms.uRevealRadius.value = refs.revealRadius;
		shaderMaterialRef.uniforms.uParallaxXY.value = refs.parallaxXY;
		shaderMaterialRef.uniforms.uParallaxZ.value = refs.parallaxZ;
		shaderMaterialRef.uniforms.uSplatStretch.value = refs.splatStretch;
		shaderMaterialRef.uniforms.uSplatCompress.value = refs.splatCompress;
		shaderMaterialRef.uniforms.uDepthBulge.value = refs.depthBulge;
		shaderMaterialRef.uniforms.uContourOffset.value = refs.contourOffset;
		shaderMaterialRef.uniforms.uBlobAmplitude.value = refs.blobAmplitude;
		shaderMaterialRef.uniforms.uNoiseAmplitude.value = refs.noiseAmplitude;
		shaderMaterialRef.uniforms.uContourInfluence.value = refs.contourInfluence;
		shaderMaterialRef.uniforms.uEdgeSoftness.value = refs.edgeSoftness;
		shaderMaterialRef.uniforms.uSaturationBoost.value = refs.saturationBoost;
		shaderMaterialRef.uniforms.uContrastBoost.value = refs.contrastBoost;
		shaderMaterialRef.uniforms.uRippleSpeed.value = refs.rippleSpeed;
		shaderMaterialRef.uniforms.uRippleFrequency.value = refs.rippleFrequency;
		shaderMaterialRef.uniforms.uRippleAmplitude.value = refs.rippleAmplitude;
		shaderMaterialRef.uniforms.uCausticScale.value = refs.causticScale;
		shaderMaterialRef.uniforms.uCausticSpeed.value = refs.causticSpeed;
		shaderMaterialRef.uniforms.uCausticIntensity.value = refs.causticIntensity;
		shaderMaterialRef.uniforms.uWaterDistortion.value = refs.waterDistortion;
		shaderMaterialRef.uniforms.uMouseRange.value.set(refs.mouseRangeX, refs.mouseRangeY);
		shaderMaterialRef.uniforms.uDepthFocusRange.value.set(
			refs.depthFocusNear,
			refs.depthFocusFar
		);
		shaderMaterialRef.uniforms.uDepthMixLow.value = refs.depthMixLow;
		shaderMaterialRef.uniforms.uParallaxAxisGain.value.set(
			refs.parallaxXGain,
			refs.parallaxYGain
		);
		shaderMaterialRef.uniforms.uRippleEdgeInfluence.value = refs.rippleEdgeInfluence;
		shaderMaterialRef.uniforms.uEdgeRippleStrength.value = refs.edgeRippleStrength;
	});

	const imageAspect = 359 / 388;
	const containerAspect = 1.78;
	const vScale = imageAspect / containerAspect;
	const vOffset = (1 - vScale) * 0.36;

	function createShaderMaterial(textures: { portrait: THREE.Texture }): THREE.ShaderMaterial {
		textures.portrait.colorSpace = THREE.SRGBColorSpace;
		textures.portrait.minFilter = THREE.LinearFilter;
		textures.portrait.magFilter = THREE.LinearFilter;

		const material = new THREE.ShaderMaterial({
			uniforms: {
				uTexture: { value: textures.portrait },
				uMouse: { value: new THREE.Vector2(0.5, 0.5) },
				uProgress: { value: 0 },
				uTime: { value: 0 },
				uDepthScale: { value: depthScale },
				uRevealRadius: { value: revealRadius },
				uParallaxXY: { value: parallaxXY },
				uParallaxZ: { value: parallaxZ },
				uSplatStretch: { value: splatStretch },
				uSplatCompress: { value: splatCompress },
				uDepthBulge: { value: depthBulge },
				uContourOffset: { value: contourOffset },
				uBlobAmplitude: { value: blobAmplitude },
				uNoiseAmplitude: { value: noiseAmplitude },
				uContourInfluence: { value: contourInfluence },
				uEdgeSoftness: { value: edgeSoftness },
				uSaturationBoost: { value: saturationBoost },
				uContrastBoost: { value: contrastBoost },
				uVScale: { value: vScale },
				uVOffset: { value: vOffset },
				uRippleSpeed: { value: rippleSpeed },
				uRippleFrequency: { value: rippleFrequency },
				uRippleAmplitude: { value: rippleAmplitude },
				uCausticScale: { value: causticScale },
				uCausticSpeed: { value: causticSpeed },
				uCausticIntensity: { value: causticIntensity },
				uWaterDistortion: { value: waterDistortion },
				uMouseRange: { value: new THREE.Vector2(mouseRangeX, mouseRangeY) },
				uDepthFocusRange: { value: new THREE.Vector2(depthFocusNear, depthFocusFar) },
				uDepthMixLow: { value: depthMixLow },
				uParallaxAxisGain: { value: new THREE.Vector2(parallaxXGain, parallaxYGain) },
				uRippleEdgeInfluence: { value: rippleEdgeInfluence },
				uEdgeRippleStrength: { value: edgeRippleStrength }
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
		uniform sampler2D uTexture;
		uniform vec2 uMouse;
		uniform float uProgress;
		uniform float uDepthScale;
		uniform float uParallaxXY;
		uniform float uParallaxZ;
		uniform float uVScale;
		uniform float uVOffset;
		uniform vec2 uMouseRange;
		uniform vec2 uDepthFocusRange;
		uniform float uDepthMixLow;
		uniform vec2 uParallaxAxisGain;

		varying vec2 vUv;
		varying vec2 vRawUv;

		float luminance(vec3 color) {
			return dot(color, vec3(0.299, 0.587, 0.114));
		}

		float softCircle(vec2 uv, vec2 center, float radius, float feather) {
			float dist = distance(uv, center);
			return 1.0 - smoothstep(radius, radius + feather, dist);
		}

		float samplePseudoDepth(vec2 uv) {
			vec3 base = texture2D(uTexture, uv).rgb;
			float luma = luminance(base);
			float warmth = smoothstep(-0.05, 0.48, base.r - base.b);
			float faceMask = softCircle(uv, vec2(0.52, 0.58), 0.12, 0.18);
			float hairMask = softCircle(uv, vec2(0.52, 0.74), 0.18, 0.2);
			float handMask = softCircle(uv, vec2(0.84, 0.48), 0.09, 0.16);
			float torsoMask = softCircle(uv, vec2(0.52, 0.34), 0.22, 0.24);
			float centerLift = 1.0 - smoothstep(0.18, 0.62, distance(uv, vec2(0.52, 0.54)));
			float vignette = smoothstep(0.48, 0.98, distance(uv, vec2(0.5, 0.55)));
			float depth = luma * 0.34
				+ warmth * 0.18
				+ faceMask * 0.24
				+ hairMask * 0.18
				+ handMask * 0.12
				+ torsoMask * 0.09
				+ centerLift * 0.18
				- vignette * 0.16;
			return clamp(depth, 0.08, 0.96);
		}

		void main() {
			vRawUv = uv;
			vUv = vec2(uv.x, uv.y * uVScale + uVOffset);

			float depthBase = samplePseudoDepth(vUv);
			float revealDepth = clamp(
				depthBase * 0.82
					+ softCircle(vUv, vec2(0.52, 0.58), 0.18, 0.24) * 0.2
					+ softCircle(vUv, vec2(0.84, 0.48), 0.1, 0.18) * 0.08,
				0.0,
				1.0
			);
			float depth = mix(depthBase, revealDepth, uProgress * 0.4);

			vec2 mouseOffset = (uMouse - 0.5) * uMouseRange;
			float depthFocus = smoothstep(uDepthFocusRange.x, uDepthFocusRange.y, depth);
			float parallaxStrength = mix(depth * uDepthMixLow, depth, depthFocus) * uDepthScale;

			vec3 displaced = position;
			displaced.x += mouseOffset.x * parallaxStrength * uParallaxXY * uParallaxAxisGain.x;
			displaced.y += mouseOffset.y * parallaxStrength * uParallaxXY * uParallaxAxisGain.y;
			displaced.z += depthFocus * depth * uDepthScale * uParallaxZ;

			gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
		}
	`;

	const fragmentShader = `
		uniform sampler2D uTexture;
		uniform vec2 uMouse;
		uniform float uProgress;
		uniform float uTime;
		uniform float uRevealRadius;
		uniform float uSplatStretch;
		uniform float uSplatCompress;
		uniform float uDepthBulge;
		uniform float uContourOffset;
		uniform float uBlobAmplitude;
		uniform float uNoiseAmplitude;
		uniform float uContourInfluence;
		uniform float uEdgeSoftness;
		uniform float uSaturationBoost;
		uniform float uContrastBoost;
		uniform float uRippleSpeed;
		uniform float uRippleFrequency;
		uniform float uRippleAmplitude;
		uniform float uCausticScale;
		uniform float uCausticSpeed;
		uniform float uCausticIntensity;
		uniform float uWaterDistortion;
		uniform float uRippleEdgeInfluence;
		uniform float uEdgeRippleStrength;

		varying vec2 vUv;
		varying vec2 vRawUv;

		vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
		vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
		vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

		float snoise(vec2 v) {
			const vec4 simplexConstants = vec4(
				0.211324865405187,
				0.366025403784439,
				-0.577350269189626,
				0.024390243902439
			);

			vec2 simplexCell = floor(v + dot(v, simplexConstants.yy));
			vec2 corner0Offset = v - simplexCell + dot(simplexCell, simplexConstants.xx);
			vec2 cornerStep = corner0Offset.x > corner0Offset.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
			vec4 cornerOffsets = corner0Offset.xyxy + simplexConstants.xxzz;
			cornerOffsets.xy -= cornerStep;

			simplexCell = mod289(simplexCell);
			vec3 gradientHash = permute(
				permute(simplexCell.y + vec3(0.0, cornerStep.y, 1.0))
					+ simplexCell.x
					+ vec3(0.0, cornerStep.x, 1.0)
			);

			vec3 cornerFalloff = max(
				0.5 - vec3(
					dot(corner0Offset, corner0Offset),
					dot(cornerOffsets.xy, cornerOffsets.xy),
					dot(cornerOffsets.zw, cornerOffsets.zw)
				),
				0.0
			);
			cornerFalloff = cornerFalloff * cornerFalloff;
			cornerFalloff = cornerFalloff * cornerFalloff;

			vec3 gradientX = 2.0 * fract(gradientHash * simplexConstants.www) - 1.0;
			vec3 gradientY = abs(gradientX) - 0.5;
			vec3 gradientSnap = floor(gradientX + 0.5);
			vec3 gradientBase = gradientX - gradientSnap;
			cornerFalloff *= 1.79284291400159
				- 0.85373472095314 * (gradientBase * gradientBase + gradientY * gradientY);

			vec3 cornerContribution;
			cornerContribution.x = gradientBase.x * corner0Offset.x + gradientY.x * corner0Offset.y;
			cornerContribution.yz = gradientBase.yz * cornerOffsets.xz + gradientY.yz * cornerOffsets.yw;
			return 130.0 * dot(cornerFalloff, cornerContribution);
		}

		float luminance(vec3 color) {
			return dot(color, vec3(0.299, 0.587, 0.114));
		}

		float softCircle(vec2 uv, vec2 center, float radius, float feather) {
			float dist = distance(uv, center);
			return 1.0 - smoothstep(radius, radius + feather, dist);
		}

		float samplePseudoDepth(vec2 uv) {
			vec3 base = texture2D(uTexture, uv).rgb;
			float luma = luminance(base);
			float warmth = smoothstep(-0.05, 0.48, base.r - base.b);
			float faceMask = softCircle(uv, vec2(0.52, 0.58), 0.12, 0.18);
			float hairMask = softCircle(uv, vec2(0.52, 0.74), 0.18, 0.2);
			float handMask = softCircle(uv, vec2(0.84, 0.48), 0.09, 0.16);
			float torsoMask = softCircle(uv, vec2(0.52, 0.34), 0.22, 0.24);
			float centerLift = 1.0 - smoothstep(0.18, 0.62, distance(uv, vec2(0.52, 0.54)));
			float vignette = smoothstep(0.48, 0.98, distance(uv, vec2(0.5, 0.55)));
			float depth = luma * 0.34
				+ warmth * 0.18
				+ faceMask * 0.24
				+ hairMask * 0.18
				+ handMask * 0.12
				+ torsoMask * 0.09
				+ centerLift * 0.18
				- vignette * 0.16;
			return clamp(depth, 0.08, 0.96);
		}

		vec3 posterize(vec3 color, float steps) {
			return floor(color * steps) / steps;
		}

		void main() {
			vec2 waterOffset = vec2(
				snoise(vUv * 3.0 + vec2(uTime * 0.2, 0.0)),
				snoise(vUv * 3.0 + vec2(100.0, uTime * 0.15))
			) * uWaterDistortion * (0.35 + 0.65 * uProgress);

			vec2 distortedUv = vUv + waterOffset;
			vec4 baseColor = texture2D(uTexture, distortedUv);
			float depth = samplePseudoDepth(distortedUv);

			float texelSize = 0.005;
			float depthLeft = samplePseudoDepth(distortedUv - vec2(texelSize, 0.0));
			float depthRight = samplePseudoDepth(distortedUv + vec2(texelSize, 0.0));
			float depthUp = samplePseudoDepth(distortedUv + vec2(0.0, texelSize));
			float depthDown = samplePseudoDepth(distortedUv - vec2(0.0, texelSize));

			vec2 depthGradient = vec2(depthRight - depthLeft, depthUp - depthDown);
			float gradientStrength = length(depthGradient);
			vec2 gradientDir = gradientStrength > 0.001 ? normalize(depthGradient) : vec2(0.0);

			vec2 toMouse = vRawUv - uMouse;
			float baseDist = length(toMouse);
			vec2 perpDir = vec2(-gradientDir.y, gradientDir.x);

			float alongGradient = dot(toMouse, gradientDir);
			float alongContour = dot(toMouse, perpDir);
			float splatStretchVal = 1.0 + gradientStrength * uSplatStretch * uProgress;
			float splatCompressVal = 1.0 - gradientStrength * uSplatCompress * uProgress;

			vec2 splatCoords = perpDir * alongContour * splatStretchVal
				+ gradientDir * alongGradient * splatCompressVal;
			float depthBulgeVal = (depth - 0.5) * uDepthBulge * uProgress;
			splatCoords *= 1.0 - depthBulgeVal;
			splatCoords += depthGradient * uContourOffset * uProgress;

			float dist = length(splatCoords);
			float angle = atan(splatCoords.y, splatCoords.x);

			float ripplePhase = baseDist * uRippleFrequency - uTime * uRippleSpeed;
			float ripple = sin(ripplePhase) * uRippleAmplitude * uProgress;
			float ripple2 = sin(ripplePhase * 1.7 + 1.0) * uRippleAmplitude * 0.5 * uProgress;
			float totalRipple = ripple + ripple2;

			float blob = 0.0;
			blob += sin(angle + uTime * 0.25) * uBlobAmplitude;
			blob += sin(angle * 2.0 - uTime * 0.18 + depth * 1.5) * (uBlobAmplitude * 0.67);
			blob += snoise(vec2(angle * 0.8 + uTime * 0.15, dist * 1.5)) * uNoiseAmplitude;
			blob +=
				snoise(vec2(angle * 1.5 - uTime * 0.2, dist * 2.5 + uTime * 0.1))
				* uNoiseAmplitude
				* 0.6;
			blob += snoise(vec2(angle * 2.5 + uTime * 0.3, dist * 4.0)) * uNoiseAmplitude * 0.3;

			float contourInfluenceVal = gradientStrength * uContourInfluence;
			blob += contourInfluenceVal * sin(angle * 1.5 + depth * 3.0 + uTime * 0.25);
			blob += totalRipple * uRippleEdgeInfluence;

			float blobDist = dist + blob * uProgress + totalRipple;
			float revealSize = uRevealRadius * uProgress;
			float edgeSoftnessModulated = uEdgeSoftness + abs(totalRipple) * uEdgeRippleStrength;
			float mask = smoothstep(
				revealSize + edgeSoftnessModulated,
				revealSize - edgeSoftnessModulated,
				blobDist
			);

			float caustic1 = snoise(distortedUv * uCausticScale + vec2(uTime * uCausticSpeed, 0.0));
			float caustic2 =
				snoise(distortedUv * uCausticScale * 1.3 + vec2(0.0, uTime * uCausticSpeed * 0.8));
			float caustic3 = snoise(
				distortedUv * uCausticScale * 0.7 - vec2(uTime * uCausticSpeed * 0.5, uTime * uCausticSpeed * 0.3)
			);
			float causticPattern = caustic1 * caustic2 + caustic2 * caustic3;
			causticPattern = pow(abs(causticPattern), 1.5) * uCausticIntensity;

			float warmth = smoothstep(-0.05, 0.48, baseColor.r - baseColor.b);
			float highlight = smoothstep(0.28, 0.88, depth);
			vec3 poster = posterize(baseColor.rgb, 5.5);
			vec3 velvet = mix(
				vec3(0.17, 0.07, 0.14),
				vec3(1.0, 0.34, 0.16),
				clamp(luminance(baseColor.rgb) * 0.7 + warmth * 0.75, 0.0, 1.0)
			);
			vec3 electric = mix(
				vec3(0.18, 0.22, 0.58),
				vec3(0.24, 0.54, 1.0),
				clamp(gradientStrength * 6.0, 0.0, 1.0)
			);

			vec3 stylized = mix(baseColor.rgb, poster * velvet * 1.12, 0.55);
			stylized = mix(stylized, baseColor.rgb + electric * (0.12 + 0.35 * highlight), 0.25);
			stylized += causticPattern * mask * uProgress * vec3(1.0, 0.42, 0.24);

			float contourLine = smoothstep(0.04, 0.18, gradientStrength + warmth * 0.08);
			stylized += electric * contourLine * mask * uProgress * 0.18;

			vec3 rgb = mix(baseColor.rgb, stylized, mask);
			float lightness = luminance(rgb);
			rgb = mix(vec3(lightness), rgb, uSaturationBoost);
			rgb = (rgb - 0.5) * uContrastBoost + 0.5;
			rgb = clamp(rgb, 0.0, 1.0);

			gl_FragColor = vec4(rgb, baseColor.a);
		}
	`;
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 2.5]} fov={45} near={0.01} far={100} />

<T.AmbientLight intensity={1} />

{#if $textures}
	<T.Mesh position={[0, 0, 0]}>
		<T.PlaneGeometry args={[4.5, 2.3, 160, 160]} />
		<T is={createShaderMaterial($textures)} />
	</T.Mesh>
{:else}
	<T.Mesh position={[0, 0, 0]}>
		<T.PlaneGeometry args={[4.5, 2.3, 1, 1]} />
		<T.MeshBasicMaterial color="#170b17" side={THREE.DoubleSide} />
	</T.Mesh>
{/if}
