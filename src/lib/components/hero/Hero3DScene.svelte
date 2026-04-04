<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import * as THREE from 'three';
import { defaultHero3DParams } from '$lib/stores/hero3dParams.svelte';

	import meImage from '$lib/images/photos/hero/me.jpeg';
	import meRobotImage from '$lib/images/photos/hero/me-robot.png';
	import meDepthImage from '$lib/images/photos/hero/me-depth.png';
	import meRobotDepthImage from '$lib/images/photos/hero/me-robot-depth.png';

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
		// Water effect parameters
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
		// Water effect defaults
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

	const { renderer } = useThrelte();

	$effect(() => {
		const r = (renderer as { current?: THREE.WebGLRenderer })?.current;
		if (r) {
		r.setClearColor(new THREE.Color('#5ba4d4'), 0);
			r.toneMapping = THREE.NoToneMapping;
			r.outputColorSpace = THREE.LinearSRGBColorSpace;
		}
	});

	const textures = useTexture({
		textureMe: meImage,
		textureRobot: meRobotImage,
		depthMe: meDepthImage,
		depthRobot: meRobotDepthImage
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
		// Water effect refs
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
		// Water effects
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

		if (shaderMaterialRef) {
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
			// Water effects
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
		}
	});

	// Image aspect ratio (me.jpeg is 3024x4032 - portrait)
	const imageAspect = 3024 / 4032; // ~0.75 (portrait)
	
	// Container dimensions: 55% of hero width (which varies), 20rem height
	// We'll use a reasonable estimate and the shader will handle the UV mapping
	// The key is that the plane fills the OrthographicCamera frustum exactly
	const containerAspect = 1.8; // Approximate, the ortho camera will fill the canvas

	// For "cover" behavior: we can only see a portion of the image height
	// vScale = how much of the image height is visible
	const vScale = imageAspect / containerAspect; // ~0.42
	// vOffset = where to position the visible window
	// Higher value = show more towards top of image (face area)
	const vOffset = (1 - vScale) * 0.62; // Show upper portion where face is

	// Create shader material from loaded textures
	function createShaderMaterial(textures: {
		textureMe: THREE.Texture;
		textureRobot: THREE.Texture;
		depthMe: THREE.Texture;
		depthRobot: THREE.Texture;
	}): THREE.ShaderMaterial {
		// Keep textures in sRGB - shader will read them as-is for accurate colors
		textures.textureMe.colorSpace = THREE.SRGBColorSpace;
		textures.textureRobot.colorSpace = THREE.SRGBColorSpace;
		
		// Ensure high quality filtering
		textures.textureMe.minFilter = THREE.LinearFilter;
		textures.textureMe.magFilter = THREE.LinearFilter;
		textures.textureRobot.minFilter = THREE.LinearFilter;
		textures.textureRobot.magFilter = THREE.LinearFilter;

		const material = new THREE.ShaderMaterial({
			uniforms: {
				uTexture1: { value: textures.textureMe },
				uTexture2: { value: textures.textureRobot },
				uDepth1: { value: textures.depthMe },
				uDepth2: { value: textures.depthRobot },
				uMouse: { value: new THREE.Vector2(0.5, 0.5) },
				uProgress: { value: 0 },
				uTime: { value: 0 },
				// Tweakable parameters
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
				// UV scale/offset for "cover" behavior
				uVScale: { value: vScale },
				uVOffset: { value: vOffset },
				// Water effect uniforms
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
		uniform sampler2D uDepth1;
		uniform sampler2D uDepth2;
		uniform vec2 uMouse;
		uniform float uProgress;
		uniform float uTime;
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
		varying float vDepth;
		
		void main() {
			vRawUv = uv; // Raw UV for mouse distance calculations
			
			// Apply UV transformation for "cover" behavior
			// U (horizontal): full width of image
			// V (vertical): only see a portion, offset to show face
			vUv = vec2(uv.x, uv.y * uVScale + uVOffset);
			
			// Sample depth from both maps using scaled UVs
			float depth1 = texture2D(uDepth1, vUv).r;
			float depth2 = texture2D(uDepth2, vUv).r;
			
			// Mix depths based on reveal progress
			float depth = mix(depth1, depth2, uProgress * 0.3);
			vDepth = depth;
			
			// Bias the interaction toward lateral motion so the head feels like it turns
			vec2 mouseOffset = (uMouse - 0.5) * uMouseRange;
			
			// Lean on the closer depth values so the face turns more than the background
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
		uniform sampler2D uTexture1;
		uniform sampler2D uTexture2;
		uniform sampler2D uDepth1;
		uniform sampler2D uDepth2;
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
		// Water effect uniforms
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
		varying float vDepth;
		
		// Simplex noise for organic blob shape
		vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
		vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
		vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
		
		float snoise(vec2 v) {
			// Standard 2D simplex-noise constants for skewing the grid and
			// mapping hashed lattice values into pseudo-random gradients.
			const vec4 simplexConstants = vec4(0.211324865405187, 0.366025403784439,
				-0.577350269189626, 0.024390243902439);
			vec2 simplexCell = floor(v + dot(v, simplexConstants.yy));
			vec2 corner0Offset = v - simplexCell + dot(simplexCell, simplexConstants.xx);
			
			// Choose which neighboring corner comes second inside this simplex triangle.
			vec2 cornerStep = (corner0Offset.x > corner0Offset.y)
				? vec2(1.0, 0.0)
				: vec2(0.0, 1.0);
			vec4 cornerOffsets = corner0Offset.xyxy + simplexConstants.xxzz;
			cornerOffsets.xy -= cornerStep;
			
			// Hash the three corners so each one gets a stable gradient direction.
			simplexCell = mod289(simplexCell);
			vec3 gradientHash = permute(permute(simplexCell.y + vec3(0.0, cornerStep.y, 1.0))
				+ simplexCell.x + vec3(0.0, cornerStep.x, 1.0));
			
			// Weight each corner contribution based on its distance from the sample point.
			vec3 cornerFalloff = max(0.5 - vec3(
				dot(corner0Offset, corner0Offset),
				dot(cornerOffsets.xy, cornerOffsets.xy),
				dot(cornerOffsets.zw, cornerOffsets.zw)
			), 0.0);
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
			cornerContribution.yz =
				gradientBase.yz * cornerOffsets.xz + gradientY.yz * cornerOffsets.yw;
			return 130.0 * dot(cornerFalloff, cornerContribution);
		}
		
		void main() {
			// ===== UNDERWATER UV DISTORTION =====
			// Create flowing water distortion before sampling textures
			vec2 waterOffset = vec2(
				snoise(vUv * 3.0 + vec2(uTime * 0.2, 0.0)),
				snoise(vUv * 3.0 + vec2(100.0, uTime * 0.15))
			) * uWaterDistortion * uProgress;
			
			// Apply distortion to UVs
			vec2 distortedUv = vUv + waterOffset;
			
			// Sample both textures using distorted UVs
			vec4 color1 = texture2D(uTexture1, distortedUv);
			vec4 color2 = texture2D(uTexture2, distortedUv);
			
			// Sample depth at this fragment (closer objects = higher value = lighter in depth map)
			float depth = texture2D(uDepth1, distortedUv).r;
			
			// Calculate depth gradient for edge warping
			// Sample neighboring depth values to get the surface normal direction
			float texelSize = 0.005;
			float depthLeft = texture2D(uDepth1, distortedUv - vec2(texelSize, 0.0)).r;
			float depthRight = texture2D(uDepth1, distortedUv + vec2(texelSize, 0.0)).r;
			float depthUp = texture2D(uDepth1, distortedUv + vec2(0.0, texelSize)).r;
			float depthDown = texture2D(uDepth1, distortedUv - vec2(0.0, texelSize)).r;
			
			// Depth gradient (surface normal in screen space)
			vec2 depthGradient = vec2(depthRight - depthLeft, depthUp - depthDown);
			float gradientStrength = length(depthGradient);
			vec2 gradientDir = gradientStrength > 0.001 ? normalize(depthGradient) : vec2(0.0);
			
			// Calculate distance from mouse (using raw UVs for consistent mouse tracking)
			vec2 toMouse = vRawUv - uMouse;
			float baseDist = length(toMouse);
			float baseAngle = atan(toMouse.y, toMouse.x);
			
			// ===== 3D SPLAT EFFECT - BLOB WARPS ONTO SURFACE =====
			
			// The blob "splats" onto the 3D surface like paint
			// It stretches along the surface slope and compresses where facing camera
			
			// 1. Calculate surface orientation from depth gradient
			// gradientDir points "downhill" on the depth surface
			vec2 perpDir = vec2(-gradientDir.y, gradientDir.x); // Along contour lines
			
			// 2. Project toMouse vector onto surface orientation
			// Split into component along gradient (into/out of surface) and along contour
			float alongGradient = dot(toMouse, gradientDir);
			float alongContour = dot(toMouse, perpDir);
			
			// 3. SPLAT DISTORTION: stretch along contours, compress along gradient
			// This simulates the blob being "painted" onto the angled surface
			float splatStretchVal = 1.0 + gradientStrength * uSplatStretch * uProgress;
			float splatCompressVal = 1.0 - gradientStrength * uSplatCompress * uProgress;
			
			// Reconstruct with splat distortion
			vec2 splatCoords = perpDir * alongContour * splatStretchVal 
			                 + gradientDir * alongGradient * splatCompressVal;
			
			// 4. Depth-based bulging - closer areas expand outward
			float depthBulgeVal = (depth - 0.5) * uDepthBulge * uProgress;
			splatCoords *= (1.0 - depthBulgeVal);
			
			// 5. Gentle offset along depth contours
			splatCoords += depthGradient * uContourOffset * uProgress;
			
			float dist = length(splatCoords);
			float angle = atan(splatCoords.y, splatCoords.x);
			
			// ===== RIPPLE WAVES =====
			// Concentric waves emanating outward from mouse position
			float ripplePhase = baseDist * uRippleFrequency - uTime * uRippleSpeed;
			float ripple = sin(ripplePhase) * uRippleAmplitude * uProgress;
			// Secondary ripple for more complex water surface
			float ripple2 = sin(ripplePhase * 1.7 + 1.0) * uRippleAmplitude * 0.5 * uProgress;
			float totalRipple = ripple + ripple2;
			
			// ===== FLUID EDGE - ENHANCED WATERY BLOB SHAPE =====
			
			// Multiple layers of flowing noise for liquid edge
			float blob = 0.0;
			
			// Primary flowing wave - slow undulation
			blob += sin(angle * 1.0 + uTime * 0.25) * uBlobAmplitude;
			blob += sin(angle * 2.0 - uTime * 0.18 + depth * 1.5) * (uBlobAmplitude * 0.67);
			
			// Layered noise for fluid turbulence
			blob += snoise(vec2(angle * 0.8 + uTime * 0.15, dist * 1.5)) * uNoiseAmplitude;
			blob += snoise(vec2(angle * 1.5 - uTime * 0.2, dist * 2.5 + uTime * 0.1)) * uNoiseAmplitude * 0.6;
			blob += snoise(vec2(angle * 2.5 + uTime * 0.3, dist * 4.0)) * uNoiseAmplitude * 0.3;
			
			// Depth-aware contouring - blob edge follows 3D form
			float contourInfluenceVal = gradientStrength * uContourInfluence;
			blob += contourInfluenceVal * sin(angle * 1.5 + depth * 3.0 + uTime * 0.25);
			
			// Add ripple influence to blob edge for watery feel
			blob += totalRipple * uRippleEdgeInfluence;
			
			// Blob-distorted distance with ripple influence
			float blobDist = dist + blob * uProgress + totalRipple;
			
			// Create blob mask - soft edge with ripple modulation
			float revealSize = uRevealRadius * uProgress;
			float edgeSoftnessModulated = uEdgeSoftness + abs(totalRipple) * uEdgeRippleStrength;
			float mask = smoothstep(revealSize + edgeSoftnessModulated, revealSize - edgeSoftnessModulated, blobDist);
			
			// Mix textures with depth-warped blob mask
			vec4 finalColor = mix(color1, color2, mask);
			
			// ===== CAUSTIC LIGHT PATTERNS =====
			// Shimmering light like sunlight through water
			float caustic1 = snoise(distortedUv * uCausticScale + vec2(uTime * uCausticSpeed, 0.0));
			float caustic2 = snoise(distortedUv * uCausticScale * 1.3 + vec2(0.0, uTime * uCausticSpeed * 0.8));
			float caustic3 = snoise(distortedUv * uCausticScale * 0.7 - vec2(uTime * uCausticSpeed * 0.5, uTime * uCausticSpeed * 0.3));
			
			// Combine caustics with sharp bright spots
			float causticPattern = caustic1 * caustic2 + caustic2 * caustic3;
			causticPattern = pow(abs(causticPattern), 1.5) * uCausticIntensity;
			
			// Apply caustics mainly to revealed area (robot texture)
			vec3 rgb = finalColor.rgb;
			rgb += causticPattern * mask * uProgress * vec3(0.9, 0.95, 1.0);
			
			// Color correction for accurate reproduction
			// Boost saturation to match source vibrancy
			float luminance = dot(rgb, vec3(0.299, 0.587, 0.114));
			rgb = mix(vec3(luminance), rgb, uSaturationBoost);
			
			// Contrast adjustment
			rgb = (rgb - 0.5) * uContrastBoost + 0.5;
			
			// Ensure colors stay in valid range
			rgb = clamp(rgb, 0.0, 1.0);
			
			gl_FragColor = vec4(rgb, finalColor.a);
		}
	`;
</script>

<T.PerspectiveCamera
	makeDefault
	position={[0, 0, 2.5]}
	fov={45}
	near={0.01}
	far={100}
/>

<T.AmbientLight intensity={1} />

{#if $textures}
	<T.Mesh position={[0, 0, 0]}>
		<T.PlaneGeometry args={[4.5, 2.3, 128, 128]} />
		<T is={createShaderMaterial($textures)} />
	</T.Mesh>
{:else}
	<T.Mesh position={[0, 0, 0]}>
		<T.PlaneGeometry args={[4.5, 2.3, 1, 1]} />
		<T.MeshBasicMaterial color="#5ba4d4" side={THREE.DoubleSide} />
	</T.Mesh>
{/if}
