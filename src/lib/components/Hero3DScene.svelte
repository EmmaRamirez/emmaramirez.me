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
	}

	let { mouseX = 0.5, mouseY = 0.5, isHovering = false }: Props = $props();

	// Get access to the Threlte context
	const { renderer } = useThrelte();

	// Configure renderer for accurate color reproduction
	$effect(() => {
		const r = (renderer as { current?: THREE.WebGLRenderer })?.current;
		if (r) {
			r.setClearColor(new THREE.Color('#5ba4d4'), 0); // Transparent to blend
			r.toneMapping = THREE.NoToneMapping;
			// Use Linear color space - shader will handle sRGB conversion
			r.outputColorSpace = THREE.LinearSRGBColorSpace;
		}
	});

	// Load textures using Threlte's useTexture (returns a promise)
	const texturePromise = useTexture({
		textureMe: meImage,
		textureRobot: meRobotImage,
		depthMe: meDepthImage,
		depthRobot: meRobotDepthImage
	});

	// Store the shader material reference so we can update uniforms
	let shaderMaterialRef: THREE.ShaderMaterial | null = null;

	// Shader uniforms state
	let time = $state(0);
	let targetMouse = { x: 0.5, y: 0.5 };
	let currentMouse = { x: 0.5, y: 0.5 };
	let revealProgress = $state(0);

	// Smooth mouse following and uniform updates
	useTask((delta) => {
		time += delta;

		// Lerp mouse position for smooth movement
		currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
		currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;

		// Animate reveal progress
		const targetProgress = isHovering ? 1 : 0;
		revealProgress += (targetProgress - revealProgress) * 0.05;

		// Update shader uniforms
		if (shaderMaterialRef) {
			shaderMaterialRef.uniforms.uTime.value = time;
			shaderMaterialRef.uniforms.uMouse.value.set(currentMouse.x, currentMouse.y);
			shaderMaterialRef.uniforms.uProgress.value = revealProgress;
		}
	});

	// Update target mouse when props change
	$effect(() => {
		targetMouse.x = mouseX;
		targetMouse.y = mouseY;
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
				uDepthScale: { value: 0.12 },
				uRevealRadius: { value: 0.3 },
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
			displaced.x += mouseOffset.x * parallaxStrength * 0.12;
			displaced.y += mouseOffset.y * parallaxStrength * 0.12;
			displaced.z += depth * uDepthScale * 0.3;
			
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
			
			// ===== DEPTH-BASED SHAPE WARPING (UNIFORM) =====
			
			// 1. Gentle depth-based radial adjustment - closer areas slightly expand
			float depthRadialWarp = (depth - 0.5) * 0.25 * uProgress;
			float warpedRadius = baseDist - depthRadialWarp;
			
			// 2. Subtle contour-following offset for depth awareness
			vec2 contourOffset = depthGradient * 0.4 * uProgress;
			vec2 warpedCoords = toMouse + contourOffset;
			
			float dist = length(warpedCoords) - depthRadialWarp;
			float angle = atan(warpedCoords.y, warpedCoords.x);
			
			// ===== UNIFORM ORGANIC BLOB SHAPE =====
			
			// Subtle depth modulation - keeps shape cohesive
			float depthNoiseMod = 1.0 + (1.0 - depth) * 0.3;
			
			// Create smooth, uniform blob shape with gentle organic edges
			float blob = 0.0;
			
			// Primary blob shape - smooth, low frequency
			blob += snoise(vec2(angle * 1.5 + uTime * 0.2, dist * 2.0)) * 0.08;
			
			// Secondary gentle wave - adds organic feel without chaos
			blob += snoise(vec2(angle * 2.5 - uTime * 0.15 + depth * 1.0, dist * 3.0)) * 0.05;
			
			// Subtle depth-aware edge - follows contours gently
			blob += gradientStrength * 0.4 * sin(angle * 2.0 + uTime * 0.3 + depth * 2.0);
			
			// Gentle depth-based bulging
			blob -= depthRadialWarp * 0.3;
			
			// Blob-distorted distance
			float blobDist = dist + blob * uProgress;
			
			// Create blob mask - slightly softer edge for organic feel
			float revealSize = uRevealRadius * uProgress;
			float mask = smoothstep(revealSize + 0.05, revealSize - 0.04, blobDist);
			
			// Mix textures with depth-warped blob mask
			vec4 finalColor = mix(color1, color2, mask);
			
			// Color correction for accurate reproduction
			// Boost saturation slightly to match source vibrancy
			vec3 rgb = finalColor.rgb;
			float luminance = dot(rgb, vec3(0.299, 0.587, 0.114));
			rgb = mix(vec3(luminance), rgb, 1.15); // 15% saturation boost
			
			// Slight contrast adjustment
			rgb = (rgb - 0.5) * 1.05 + 0.5;
			
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
