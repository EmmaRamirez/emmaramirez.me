<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import * as THREE from 'three';

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
	}

	let { 
		mouseX = 0.5, 
		mouseY = 0.5, 
		isHovering = false,
		depthScale = 0.12,
		revealRadius = 0.3,
		parallaxXY = 0.12,
		parallaxZ = 0.3,
		splatStretch = 2.5,
		splatCompress = 0.6,
		depthBulge = 0.35,
		contourOffset = 0.5,
		blobAmplitude = 0.03,
		noiseAmplitude = 0.04,
		contourInfluence = 0.6,
		edgeSoftness = 0.06,
		saturationBoost = 1.15,
		contrastBoost = 1.05
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

	const texturePromise = useTexture({
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
		depthScale: 0.12,
		revealRadius: 0.3,
		parallaxXY: 0.12,
		parallaxZ: 0.3,
		splatStretch: 2.5,
		splatCompress: 0.6,
		depthBulge: 0.35,
		contourOffset: 0.5,
		blobAmplitude: 0.03,
		noiseAmplitude: 0.04,
		contourInfluence: 0.6,
		edgeSoftness: 0.06,
		saturationBoost: 1.15,
		contrastBoost: 1.05
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
	});

	useTask((delta) => {
		refs.time += delta;

		refs.currentMouse.x += (refs.targetMouse.x - refs.currentMouse.x) * 0.08;
		refs.currentMouse.y += (refs.targetMouse.y - refs.currentMouse.y) * 0.08;

		const targetProgress = refs.isHovering ? 1 : 0;
		refs.revealProgress += (targetProgress - refs.revealProgress) * 0.05;

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
		}
	});

	// Image aspect ratio (me.jpeg is 3024x4032 - portrait)
	const imageAspect = 3024 / 4032; // ~0.75 (portrait)
	
	// Container dimensions: 55% of hero width (which varies), 320px height
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
			
			// Calculate displacement based on mouse position
			vec2 mouseOffset = (uMouse - 0.5) * 2.0;
			
			// Parallax effect - closer objects (lighter depth) move more
			float parallaxStrength = depth * uDepthScale;
			vec3 displaced = position;
			displaced.x += mouseOffset.x * parallaxStrength * uParallaxXY;
			displaced.y += mouseOffset.y * parallaxStrength * uParallaxXY;
			displaced.z += depth * uDepthScale * uParallaxZ;
			
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
		
		varying vec2 vUv;
		varying vec2 vRawUv;
		varying float vDepth;
		
		// Simplex noise for organic blob shape
		vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
		vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
		vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
		
		float snoise(vec2 v) {
			const vec4 C = vec4(0.211324865405187, 0.366025403784439,
				-0.577350269189626, 0.024390243902439);
			vec2 i  = floor(v + dot(v, C.yy));
			vec2 x0 = v -   i + dot(i, C.xx);
			vec2 i1;
			i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
			vec4 x12 = x0.xyxy + C.xxzz;
			x12.xy -= i1;
			i = mod289(i);
			vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
				+ i.x + vec3(0.0, i1.x, 1.0));
			vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
				dot(x12.zw,x12.zw)), 0.0);
			m = m*m;
			m = m*m;
			vec3 x = 2.0 * fract(p * C.www) - 1.0;
			vec3 h = abs(x) - 0.5;
			vec3 ox = floor(x + 0.5);
			vec3 a0 = x - ox;
			m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
			vec3 g;
			g.x  = a0.x  * x0.x  + h.x  * x0.y;
			g.yz = a0.yz * x12.xz + h.yz * x12.yw;
			return 130.0 * dot(m, g);
		}
		
		void main() {
			// Sample both textures using scaled UVs
			vec4 color1 = texture2D(uTexture1, vUv);
			vec4 color2 = texture2D(uTexture2, vUv);
			
			// Sample depth at this fragment (closer objects = higher value = lighter in depth map)
			float depth = texture2D(uDepth1, vUv).r;
			
			// Calculate depth gradient for edge warping
			// Sample neighboring depth values to get the surface normal direction
			float texelSize = 0.005;
			float depthLeft = texture2D(uDepth1, vUv - vec2(texelSize, 0.0)).r;
			float depthRight = texture2D(uDepth1, vUv + vec2(texelSize, 0.0)).r;
			float depthUp = texture2D(uDepth1, vUv + vec2(0.0, texelSize)).r;
			float depthDown = texture2D(uDepth1, vUv - vec2(0.0, texelSize)).r;
			
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
			
			// ===== SMOOTH ORGANIC BLOB SHAPE =====
			
			// Very smooth, low-frequency noise for soft edges
			float blob = 0.0;
			
			// Primary shape - very smooth sine wave
			blob += sin(angle * 1.0 + uTime * 0.15) * uBlobAmplitude;
			blob += sin(angle * 2.0 - uTime * 0.1 + depth * 1.5) * (uBlobAmplitude * 0.67);
			
			// Gentle organic variation - single low frequency noise
			blob += snoise(vec2(angle * 0.8 + uTime * 0.1, dist * 1.5)) * uNoiseAmplitude;
			
			// Depth-aware contouring - blob edge follows 3D form
			float contourInfluenceVal = gradientStrength * uContourInfluence;
			blob += contourInfluenceVal * sin(angle * 1.5 + depth * 3.0 + uTime * 0.2);
			
			// Blob-distorted distance
			float blobDist = dist + blob * uProgress;
			
			// Create blob mask - very soft edge for smooth look
			float revealSize = uRevealRadius * uProgress;
			float mask = smoothstep(revealSize + uEdgeSoftness, revealSize - (uEdgeSoftness * 0.83), blobDist);
			
			// Mix textures with depth-warped blob mask
			vec4 finalColor = mix(color1, color2, mask);
			
			// Color correction for accurate reproduction
			// Boost saturation to match source vibrancy
			vec3 rgb = finalColor.rgb;
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

<!-- PerspectiveCamera with lower FOV to reduce distortion -->
<!-- Position camera further back with narrower FOV = less perspective distortion -->
<T.PerspectiveCamera
	makeDefault
	position={[0, 0, 2.5]}
	fov={45}
	near={0.01}
	far={100}
/>

<T.AmbientLight intensity={1} />

<!-- Wrap entire mesh in await block for proper Threlte handling -->
<!-- Plane sized to fill the viewport: height ~2.07 at fov=45, z=2.5. Make it slightly larger to ensure fill -->
{#await texturePromise}
	<!-- Loading state: blue plane -->
	<T.Mesh position={[0, 0, 0]}>
		<T.PlaneGeometry args={[4.5, 2.3, 1, 1]} />
		<T.MeshBasicMaterial color="#5ba4d4" side={THREE.DoubleSide} />
	</T.Mesh>
{:then textures}
	<!-- Loaded: plane with parallax shader -->
	<T.Mesh position={[0, 0, 0]}>
		<T.PlaneGeometry args={[4.5, 2.3, 128, 128]} />
		<T is={createShaderMaterial(textures)} />
	</T.Mesh>
{:catch}
	<!-- Error state: red plane -->
	<T.Mesh position={[0, 0, 0]}>
		<T.PlaneGeometry args={[4.5, 2.3, 1, 1]} />
		<T.MeshBasicMaterial color="#ff0000" side={THREE.DoubleSide} />
	</T.Mesh>
{/await}
