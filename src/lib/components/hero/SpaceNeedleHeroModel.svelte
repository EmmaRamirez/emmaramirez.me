<script lang="ts">
	import defaultReflectionImage from '$lib/images/photos/seattle-night.jpg';
	import spaceNeedleModel from '$lib/assets/models/space_needle_v2_reference_study.glb';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

	type Props = {
		canvasSize?: number | null;
		variant?: 'hero' | 'overlay';
		/** Seattle plate currently visible behind the model, also used as the PMREM reflection source. */
		reflectionImage?: string;
		/** True when the visible Seattle plate is the dark/night version. */
		reflectionIsDark?: boolean;
	};

	type ChromePart = 'spire' | 'windowBand' | 'deck' | 'base' | 'body';
	type ChromeReflectionUniforms = {
		map: { value: THREE.Texture };
		viewport: { value: THREE.Vector2 };
	};

	const CHROME_PART_SETTINGS: Record<
		ChromePart,
		{
			color: THREE.ColorRepresentation;
			emissive: THREE.ColorRepresentation;
			emissiveIntensity: number;
			roughness: number;
			reflectionStrength: number;
		}
	> = {
		spire: {
			color: '#fbfdff',
			emissive: '#0b1018',
			emissiveIntensity: 0.015,
			roughness: 0.006,
			reflectionStrength: 0.88
		},
		windowBand: {
			color: '#f1f7ff',
			emissive: '#121721',
			emissiveIntensity: 0.02,
			roughness: 0.012,
			reflectionStrength: 1
		},
		deck: {
			color: '#f8fbff',
			emissive: '#111822',
			emissiveIntensity: 0.018,
			roughness: 0.008,
			reflectionStrength: 0.98
		},
		base: {
			color: '#f2f7fb',
			emissive: '#0c1016',
			emissiveIntensity: 0.012,
			roughness: 0.014,
			reflectionStrength: 0.82
		},
		body: {
			color: '#f7fbff',
			emissive: '#0d1219',
			emissiveIntensity: 0.014,
			roughness: 0.01,
			reflectionStrength: 0.94
		}
	};

	let {
		canvasSize = null,
		variant = 'hero',
		reflectionImage = defaultReflectionImage,
		reflectionIsDark = false
	}: Props = $props();

	const canvasStyle = $derived(
		canvasSize ? `width: ${canvasSize}px; height: ${canvasSize}px;` : undefined
	);

	function canUseWebGL(): boolean {
		if (typeof document === 'undefined') return false;

		const canvas = document.createElement('canvas');
		return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
	}

	function createChromeFallbackTexture() {
		const texture = new THREE.DataTexture(
			new Uint8Array([11, 16, 25, 255, 232, 240, 250, 255, 244, 176, 86, 255, 28, 38, 56, 255]),
			2,
			2,
			THREE.RGBAFormat
		);

		texture.colorSpace = THREE.SRGBColorSpace;
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.needsUpdate = true;
		return texture;
	}

	function createMirrorChromeMaterial(
		part: ChromePart,
		reflectionUniforms: ChromeReflectionUniforms
	) {
		const settings = CHROME_PART_SETTINGS[part];
		const material = new THREE.MeshPhysicalMaterial({
			color: settings.color,
			emissive: settings.emissive,
			emissiveIntensity: settings.emissiveIntensity,
			metalness: 1,
			roughness: settings.roughness,
			envMapIntensity: 3.5,
			clearcoat: 1,
			clearcoatRoughness: 0.016,
			ior: 2.33,
			reflectivity: 1,
			specularColor: '#ffffff',
			specularIntensity: 1
		});

		material.onBeforeCompile = (shader) => {
			shader.uniforms.uChromeReflectionMap = reflectionUniforms.map;
			shader.uniforms.uChromeViewport = reflectionUniforms.viewport;
			shader.uniforms.uChromeReflectionStrength = { value: settings.reflectionStrength };

			shader.vertexShader = shader.vertexShader
				.replace(
					'#include <common>',
					`#include <common>
varying vec3 vChromeWorldNormal;
varying vec3 vChromeWorldPosition;`
				)
				.replace(
					'#include <skinnormal_vertex>',
					`#include <skinnormal_vertex>
vChromeWorldNormal = normalize(mat3(modelMatrix) * objectNormal);`
				)
				.replace(
					'#include <displacementmap_vertex>',
					`#include <displacementmap_vertex>
vChromeWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;`
				);

			shader.fragmentShader = shader.fragmentShader
				.replace(
					'#include <common>',
					`#include <common>
uniform sampler2D uChromeReflectionMap;
uniform vec2 uChromeViewport;
uniform float uChromeReflectionStrength;
varying vec3 vChromeWorldNormal;
varying vec3 vChromeWorldPosition;

vec2 chromeMirrorRepeat(vec2 uv) {
	return abs(fract(uv) * 2.0 - 1.0);
}

vec2 chromeSphericalUv(vec3 direction) {
	return vec2(
		atan(direction.z, direction.x) * 0.159154943 + 0.5,
		asin(clamp(direction.y, -1.0, 1.0)) * 0.318309886 + 0.5
	);
}

vec3 chromeBoostColor(vec3 color) {
	float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
	color = mix(vec3(luma), color, 2.65);
	return max(color - vec3(0.04), vec3(0.0)) * 1.85;
}

vec3 chromePlateSample(vec2 uv) {
	vec3 color = texture2D(uChromeReflectionMap, chromeMirrorRepeat(uv)).rgb;
	float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
	color = mix(color * 0.34, pow(color, vec3(0.82)) * 0.98, smoothstep(0.08, 0.82, luma));
	return chromeBoostColor(color);
}`
				)
				.replace(
					'#include <opaque_fragment>',
					`vec2 chromeCanvasUv = gl_FragCoord.xy / max(uChromeViewport, vec2(1.0));
chromeCanvasUv.y = 1.0 - chromeCanvasUv.y;
vec2 chromeCenterVector = (chromeCanvasUv - vec2(0.5, 0.46)) * vec2(11.0, 9.5);
vec3 chromeScreenNormal = normalize(vec3(
	chromeCenterVector,
	sqrt(max(0.08, 1.0 - dot(chromeCenterVector, chromeCenterVector)))
));
vec3 chromeNormal = normalize(mix(normalize(vChromeWorldNormal), chromeScreenNormal, 0.58));
vec3 chromeViewDirection = normalize(cameraPosition - vChromeWorldPosition);
vec3 chromeReflectionDirection = reflect(-chromeViewDirection, chromeNormal);
float chromeFresnel = pow(1.0 - clamp(dot(chromeNormal, chromeViewDirection), 0.0, 1.0), 2.2);
vec2 chromeSurroundingUv = vec2(1.0 - chromeCanvasUv.x, chromeCanvasUv.y) + vec2(0.28, 0.18);
chromeSurroundingUv += chromeNormal.xy * vec2(0.3, -0.24) + chromeReflectionDirection.xz * 0.16;
chromeSurroundingUv += vec2(
	sin(vChromeWorldPosition.x * 9.0 + vChromeWorldPosition.y * 5.0) * 0.08,
	cos(vChromeWorldPosition.z * 6.0 + vChromeWorldPosition.x * 4.0) * 0.05
);
vec2 chromeWorldUv = chromeSphericalUv(chromeReflectionDirection);
chromeWorldUv = vec2(
	chromeWorldUv.x + vChromeWorldPosition.x * 0.018,
	chromeWorldUv.y * 0.58 + 0.3 + vChromeWorldPosition.y * 0.012
);
vec2 chromeSkyUv = vec2(
	0.5 + chromeReflectionDirection.x * 0.5 + chromeNormal.x * 0.22,
	0.22 - chromeReflectionDirection.y * 0.16 + chromeNormal.y * 0.1
);
vec2 chromeCityUv = vec2(
	0.5 - chromeReflectionDirection.x * 0.58 + chromeNormal.x * 0.34,
	0.73 - chromeNormal.y * 0.32 + abs(chromeReflectionDirection.y) * 0.12
);
vec3 chromeScreenReflection = chromePlateSample(chromeSurroundingUv);
vec3 chromeWorldReflection = chromePlateSample(chromeWorldUv);
vec3 chromeSkyReflection = chromePlateSample(chromeSkyUv);
vec3 chromeCityReflection = chromePlateSample(chromeCityUv);
float chromeBand = smoothstep(
	0.16,
	0.92,
	abs(sin(vChromeWorldPosition.x * 12.0 + vChromeWorldPosition.y * 7.0 + chromeNormal.x * 5.0))
);
vec3 chromeLowerCityReflection = chromePlateSample(vec2(
	0.12 + abs(fract(chromeCanvasUv.x * 1.85 + chromeNormal.x * 0.45)) * 0.82,
	0.78 + chromeScreenNormal.y * 0.12 + chromeBand * 0.08
));
vec3 chromeSideReflection = chromePlateSample(vec2(
	0.88 - abs(chromeScreenNormal.x) * 0.68,
	0.62 + chromeBand * 0.26 - chromeNormal.y * 0.08
));
float chromeCityMix = smoothstep(-0.22, 0.68, -chromeNormal.y + chromeBand * 0.46);
vec3 chromeReflection = mix(chromeSkyReflection, chromeLowerCityReflection, 0.68);
chromeReflection = mix(chromeReflection, chromeCityReflection, chromeCityMix * 0.56);
chromeReflection = mix(chromeReflection, chromeSideReflection, 0.24);
chromeReflection = mix(chromeReflection, chromeScreenReflection, 0.34);
chromeReflection = mix(chromeReflection, chromeWorldReflection, 0.18);
float chromeHardStripe = smoothstep(
	0.42,
	0.58,
	sin(chromeScreenNormal.x * 7.0 + chromeCanvasUv.y * 16.0 + chromeNormal.x * 5.0) * 0.5 + 0.5
);
float chromeScreenStripe = smoothstep(
	0.38,
	0.68,
	sin(chromeCanvasUv.x * 96.0 + chromeCanvasUv.y * 22.0 + chromeNormal.x * 4.0) * 0.5 + 0.5
);
float chromeSharpStripe = smoothstep(
	0.82,
	0.96,
	sin(chromeCanvasUv.x * 180.0 - chromeCanvasUv.y * 34.0) * 0.5 + 0.5
);
chromeReflection = mix(
	chromeReflection * 0.24,
	chromeReflection * 2.05 + vec3(0.13, 0.14, 0.15),
	clamp(chromeHardStripe * 0.42 + chromeScreenStripe * 0.36 + chromeBand * 0.24, 0.0, 0.86)
);
float chromeImageLuma = dot(chromeReflection, vec3(0.2126, 0.7152, 0.0722));
float chromeImageWarmth = clamp((chromeReflection.r * 1.35 + chromeReflection.g * 0.45 - chromeReflection.b) * 1.45, 0.0, 1.0);
vec3 chromeTint = mix(
	vec3(0.012, 0.03, 0.07),
	vec3(0.16, 0.68, 1.0),
	smoothstep(0.04, 0.62, chromeImageLuma)
);
chromeTint = mix(
	chromeTint,
	vec3(1.05, 0.68, 0.3),
	clamp(chromeImageWarmth * 0.58 + chromeHardStripe * 0.18, 0.0, 0.62)
);
float chromeSweep = smoothstep(
	-0.82,
	0.86,
	chromeScreenNormal.x + sin(chromeCanvasUv.y * 18.0 + chromeNormal.x * 3.0) * 0.18
);
vec3 chromeBlue = mix(vec3(0.0, 0.12, 0.42), vec3(0.0, 0.76, 1.0), chromeSweep);
vec3 chromeGold = vec3(1.0, 0.66, 0.16) * smoothstep(0.18, 0.76, chromeHardStripe + chromeImageWarmth * 0.54);
vec3 chromePalette = mix(chromeBlue, chromeGold, clamp(chromeHardStripe * 0.44 + chromeImageWarmth * 0.22, 0.0, 0.58));
chromePalette *= 0.82 + chromeBand * 0.48 + chromeFresnel * 0.28;
chromeReflection = chromePalette + chromeReflection * 0.12;
chromeReflection += vec3(0.95, 0.96, 1.0) * chromeSharpStripe * 0.42;
chromeReflection += vec3(1.0, 0.88, 0.68) * chromeFresnel * 0.18;
float chromeMix = clamp(0.9 + uChromeReflectionStrength * 0.08 + chromeFresnel * 0.05, 0.0, 1.0);
outgoingLight = mix(outgoingLight * 0.01, chromeReflection, chromeMix);
#include <opaque_fragment>`
				)
				.replace(
					'#include <dithering_fragment>',
					`vec3 chromeDisplay = clamp(chromeReflection, vec3(0.0), vec3(1.0));
gl_FragColor.rgb = mix(gl_FragColor.rgb * 0.18, chromeDisplay, chromeMix);
gl_FragColor.rgb += vec3(1.0, 0.88, 0.62) * chromeFresnel * 0.18;
gl_FragColor.rgb = clamp(gl_FragColor.rgb, vec3(0.0), vec3(1.0));
#include <dithering_fragment>`
				);
		};

		material.customProgramCacheKey = () => 'space-needle-mirror-chrome';
		return material;
	}

	function disposeObject(object: THREE.Object3D) {
		object.traverse((child) => {
			if (!(child instanceof THREE.Mesh)) return;

			child.geometry.dispose();
			const materials = Array.isArray(child.material) ? child.material : [child.material];
			for (const material of materials) {
				for (const [key, value] of Object.entries(material)) {
					if (key === 'envMap') continue;
					if (value instanceof THREE.Texture) {
						value.dispose();
					}
				}
				material.dispose();
			}
		});
	}

	function getChromePart(mesh: THREE.Mesh): ChromePart {
		mesh.geometry.computeBoundingBox();
		const bounds = mesh.geometry.boundingBox;
		const center = bounds?.getCenter(new THREE.Vector3()) ?? new THREE.Vector3();
		const size = bounds?.getSize(new THREE.Vector3()) ?? new THREE.Vector3();
		const radialDistance = Math.hypot(center.x, center.y);
		const isNeedleOrMast = size.x < 1.2 && size.y < 1.2 && center.z > 18;
		const isWindowBand = center.z > 14 && center.z < 23 && radialDistance > 8 && size.z < 0.5;
		const isObservationDeck = center.z > 8 && center.z < 24 && radialDistance > 10;
		const isBase = center.z < 1.9 && radialDistance > 4;

		if (isNeedleOrMast) return 'spire';
		if (isWindowBand) return 'windowBand';
		if (isObservationDeck) return 'deck';
		if (isBase) return 'base';
		return 'body';
	}

	function prepareModel(object: THREE.Object3D, reflectionUniforms: ChromeReflectionUniforms) {
		object.traverse((child) => {
			if (!(child instanceof THREE.Mesh)) return;

			child.material = createMirrorChromeMaterial(getChromePart(child), reflectionUniforms);
			child.castShadow = true;
			child.receiveShadow = true;
		});
	}

	function refreshEnvironmentMaterials(
		object: THREE.Object3D,
		envMap: THREE.Texture | null,
		intensity: number,
		rotation: THREE.Euler
	) {
		object.traverse((child) => {
			if (!(child instanceof THREE.Mesh)) return;

			const materials = Array.isArray(child.material) ? child.material : [child.material];
			for (const material of materials) {
				if (material instanceof THREE.MeshStandardMaterial) {
					material.envMap = envMap;
					material.envMapIntensity = intensity;
					material.envMapRotation.copy(rotation);
				}
				material.needsUpdate = true;
			}
		});
	}

	function fitCameraToObject(camera: THREE.PerspectiveCamera, object: THREE.Object3D) {
		object.updateMatrixWorld(true);
		const bounds = new THREE.Box3().setFromObject(object);
		const sphere = bounds.getBoundingSphere(new THREE.Sphere());
		if (sphere.radius <= 0) return;

		const halfFov = THREE.MathUtils.degToRad(camera.fov) / 2;
		const distance = (sphere.radius * 1.28) / Math.sin(halfFov);
		camera.position.set(sphere.center.x, sphere.center.y, sphere.center.z + distance);
		camera.near = Math.max(0.01, distance - sphere.radius * 3);
		camera.far = distance + sphere.radius * 3;
		camera.lookAt(sphere.center);
		camera.updateProjectionMatrix();
	}

	function setupSpaceNeedle(reflectionUrl: string, useDarkReflection: boolean) {
		return (host: Element) => {
			if (!(host instanceof HTMLDivElement) || !canUseWebGL()) return;

			const scene = new THREE.Scene();
			scene.environmentIntensity = useDarkReflection ? 4.8 : 3.9;
			scene.environmentRotation.set(0.34, useDarkReflection ? 1.15 : 0.95, 0);

			const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
			camera.position.set(0, 0, 6);

			const renderer = new THREE.WebGLRenderer({
				alpha: true,
				antialias: true,
				powerPreference: 'high-performance'
			});
			renderer.outputColorSpace = THREE.SRGBColorSpace;
			renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.toneMappingExposure = useDarkReflection ? 1.18 : 1.08;
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			host.appendChild(renderer.domElement);

			const pmremGenerator = new THREE.PMREMGenerator(renderer);
			pmremGenerator.compileEquirectangularShader();
			const textureLoader = new THREE.TextureLoader();
			const fallbackReflectionTexture = createChromeFallbackTexture();
			const chromeReflectionUniforms: ChromeReflectionUniforms = {
				map: { value: fallbackReflectionTexture },
				viewport: { value: new THREE.Vector2(1, 1) }
			};
			const modelRoot = new THREE.Group();
			modelRoot.rotation.set(-0.2, 0.82, -0.1);
			scene.add(modelRoot);

			let envRenderTarget: THREE.WebGLRenderTarget | null = null;
			let reflectionTexture: THREE.Texture | null = null;
			let envLoadId = 0;
			let disposed = false;
			let loadedModel: THREE.Object3D | null = null;
			let frame = 0;
			let lastTime = performance.now();

			function rebuildReflectionEnvironment() {
				const loadId = ++envLoadId;
				if (envRenderTarget) {
					refreshEnvironmentMaterials(modelRoot, null, 1, scene.environmentRotation);
					envRenderTarget.dispose();
					envRenderTarget = null;
				}
				if (reflectionTexture) {
					chromeReflectionUniforms.map.value = fallbackReflectionTexture;
					reflectionTexture.dispose();
					reflectionTexture = null;
				}

				scene.environment = null;
				textureLoader.load(reflectionUrl, (texture) => {
					if (disposed || loadId !== envLoadId) {
						texture.dispose();
						return;
					}

					texture.colorSpace = THREE.SRGBColorSpace;
					texture.mapping = THREE.EquirectangularReflectionMapping;
					texture.minFilter = THREE.LinearFilter;
					texture.magFilter = THREE.LinearFilter;
					reflectionTexture = texture;
					chromeReflectionUniforms.map.value = texture;
					envRenderTarget = pmremGenerator.fromEquirectangular(texture);
					scene.environment = envRenderTarget.texture;
					scene.environmentIntensity = useDarkReflection ? 4.8 : 3.9;
					scene.environmentRotation.set(0.34, useDarkReflection ? 1.15 : 0.95, 0);
					refreshEnvironmentMaterials(
						modelRoot,
						envRenderTarget.texture,
						scene.environmentIntensity,
						scene.environmentRotation
					);
				});
			}

			rebuildReflectionEnvironment();

			const baseRotation = {
				x: modelRoot.rotation.x,
				y: modelRoot.rotation.y,
				z: modelRoot.rotation.z
			};
			const targetRotation = { ...baseRotation };
			const angularVelocity = { x: 0, y: 0, z: 0 };
			const previousPointer = { x: 0, y: 0, time: 0 };
			let isDragging = false;

			const keyLight = new THREE.DirectionalLight('#fff1e6', 1.15);
			keyLight.position.set(3, 4, 5);
			scene.add(keyLight);

			const fillLight = new THREE.DirectionalLight('#8aa1ff', 0.65);
			fillLight.position.set(-3, 1.5, 2.5);
			scene.add(fillLight);

			const rimLight = new THREE.DirectionalLight('#ff7a55', 1.4);
			rimLight.position.set(-1.5, 2, -3);
			scene.add(rimLight);

			scene.add(new THREE.AmbientLight('#ffe5da', 0.25));

			function setTargetFromPointer(event: PointerEvent) {
				const { width, height, left, top } = host.getBoundingClientRect();
				if (width <= 0 || height <= 0) return;

				const pointerX = ((event.clientX - left) / width - 0.5) * 2;
				const pointerY = ((event.clientY - top) / height - 0.5) * 2;

				targetRotation.x = baseRotation.x + pointerY * 0.95;
				targetRotation.y = baseRotation.y + pointerX * 1.15;
				targetRotation.z = baseRotation.z + pointerX * pointerY * 0.45;
			}

			function syncTargetToCurrent() {
				targetRotation.x = modelRoot.rotation.x;
				targetRotation.y = modelRoot.rotation.y;
				targetRotation.z = modelRoot.rotation.z;
			}

			function clampVelocity(value: number) {
				return THREE.MathUtils.clamp(value, -7, 7);
			}

			const handlePointerDown = (event: PointerEvent) => {
				isDragging = true;
				angularVelocity.x = 0;
				angularVelocity.y = 0;
				angularVelocity.z = 0;
				previousPointer.x = event.clientX;
				previousPointer.y = event.clientY;
				previousPointer.time = event.timeStamp;
				host.setPointerCapture(event.pointerId);
				syncTargetToCurrent();
			};

			const handlePointerMove = (event: PointerEvent) => {
				if (!isDragging) {
					setTargetFromPointer(event);
					return;
				}

				const { width, height, left, top } = host.getBoundingClientRect();
				if (width <= 0 || height <= 0) return;

				const deltaTime = Math.max((event.timeStamp - previousPointer.time) / 1000, 0.001);
				const deltaX = (event.clientX - previousPointer.x) / width;
				const deltaY = (event.clientY - previousPointer.y) / height;
				const pointerX = ((event.clientX - left) / width - 0.5) * 2;
				const pointerY = ((event.clientY - top) / height - 0.5) * 2;
				const rotationDelta = {
					x: deltaY * 4.2,
					y: deltaX * 4.2,
					z: (deltaX * pointerY - deltaY * pointerX) * 2.2
				};

				modelRoot.rotation.x += rotationDelta.x;
				modelRoot.rotation.y += rotationDelta.y;
				modelRoot.rotation.z += rotationDelta.z;
				angularVelocity.x = clampVelocity(rotationDelta.x / deltaTime);
				angularVelocity.y = clampVelocity(rotationDelta.y / deltaTime);
				angularVelocity.z = clampVelocity(rotationDelta.z / deltaTime);
				previousPointer.x = event.clientX;
				previousPointer.y = event.clientY;
				previousPointer.time = event.timeStamp;
				syncTargetToCurrent();
			};

			const handlePointerUp = (event: PointerEvent) => {
				if (!isDragging) return;

				isDragging = false;
				if (host.hasPointerCapture(event.pointerId)) {
					host.releasePointerCapture(event.pointerId);
				}
				syncTargetToCurrent();
			};

			const handlePointerCancel = (event: PointerEvent) => {
				isDragging = false;
				angularVelocity.x = 0;
				angularVelocity.y = 0;
				angularVelocity.z = 0;
				if (host.hasPointerCapture(event.pointerId)) {
					host.releasePointerCapture(event.pointerId);
				}
				syncTargetToCurrent();
			};

			const handlePointerLeave = () => {
				if (isDragging) return;

				targetRotation.x = baseRotation.x;
				targetRotation.y = baseRotation.y;
				targetRotation.z = baseRotation.z;
			};

			const resize = () => {
				const { width, height } = host.getBoundingClientRect();
				if (width <= 0 || height <= 0) return;

				renderer.setSize(width, height, false);
				chromeReflectionUniforms.viewport.value.set(
					renderer.domElement.width,
					renderer.domElement.height
				);
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
			};

			const resizeObserver = new ResizeObserver(resize);
			resizeObserver.observe(host);
			resize();
			host.addEventListener('pointerdown', handlePointerDown);
			host.addEventListener('pointermove', handlePointerMove, { passive: true });
			host.addEventListener('pointerup', handlePointerUp);
			host.addEventListener('pointercancel', handlePointerCancel);
			host.addEventListener('pointerleave', handlePointerLeave);

			const loader = new GLTFLoader();
			loader.load(spaceNeedleModel, (gltf) => {
				if (disposed) {
					disposeObject(gltf.scene);
					return;
				}

				loadedModel = gltf.scene;
				const bounds = new THREE.Box3().setFromObject(loadedModel);
				const size = bounds.getSize(new THREE.Vector3());
				const center = bounds.getCenter(new THREE.Vector3());
				const maxDimension = Math.max(size.x, size.y, size.z);

				loadedModel.position.sub(center);
				prepareModel(loadedModel, chromeReflectionUniforms);
				if (envRenderTarget) {
					refreshEnvironmentMaterials(
						loadedModel,
						envRenderTarget.texture,
						scene.environmentIntensity,
						scene.environmentRotation
					);
				}

				const modelFrame = new THREE.Group();
				modelFrame.rotation.x = -Math.PI / 2;
				modelFrame.scale.setScalar(maxDimension > 0 ? 3.4 / maxDimension : 1);
				modelFrame.add(loadedModel);
				modelRoot.add(modelFrame);
				fitCameraToObject(camera, modelFrame);
			});

			const render = (time: number) => {
				const delta = Math.min((time - lastTime) / 1000, 0.05);
				lastTime = time;

				if (!isDragging) {
					const velocityMagnitude = Math.hypot(
						angularVelocity.x,
						angularVelocity.y,
						angularVelocity.z
					);

					if (velocityMagnitude > 0.01) {
						modelRoot.rotation.x += angularVelocity.x * delta;
						modelRoot.rotation.y += angularVelocity.y * delta;
						modelRoot.rotation.z += angularVelocity.z * delta;

						const damping = Math.exp(-delta * 1.8);
						angularVelocity.x *= damping;
						angularVelocity.y *= damping;
						angularVelocity.z *= damping;
						syncTargetToCurrent();
					} else {
						angularVelocity.x = 0;
						angularVelocity.y = 0;
						angularVelocity.z = 0;
						const smoothing = 1 - Math.exp(-delta * 8);
						modelRoot.rotation.x += (targetRotation.x - modelRoot.rotation.x) * smoothing;
						modelRoot.rotation.y += (targetRotation.y - modelRoot.rotation.y) * smoothing;
						modelRoot.rotation.z += (targetRotation.z - modelRoot.rotation.z) * smoothing;
					}
				}

				renderer.render(scene, camera);
				frame = requestAnimationFrame(render);
			};

			frame = requestAnimationFrame(render);

			return () => {
				disposed = true;
				cancelAnimationFrame(frame);
				resizeObserver.disconnect();
				host.removeEventListener('pointerdown', handlePointerDown);
				host.removeEventListener('pointermove', handlePointerMove);
				host.removeEventListener('pointerup', handlePointerUp);
				host.removeEventListener('pointercancel', handlePointerCancel);
				host.removeEventListener('pointerleave', handlePointerLeave);
				envLoadId += 1;
				if (envRenderTarget) {
					envRenderTarget.dispose();
					envRenderTarget = null;
				}
				if (reflectionTexture) {
					reflectionTexture.dispose();
					reflectionTexture = null;
				}
				fallbackReflectionTexture.dispose();
				scene.environment = null;
				pmremGenerator.dispose();
				if (loadedModel) disposeObject(loadedModel);
				renderer.dispose();
				if (renderer.domElement.parentNode === host) {
					host.removeChild(renderer.domElement);
				}
			};
		};
	}
</script>

<div
	class={[
		'space-needle-hero',
		canvasSize && 'space-needle-hero--sized',
		variant === 'overlay' && 'space-needle-hero--overlay'
	]}
	style={canvasStyle}
	aria-hidden="true"
>
	<div
		{@attach setupSpaceNeedle(reflectionImage, reflectionIsDark)}
		class="space-needle-hero__canvas"
	></div>
	<div class="space-needle-hero__glow"></div>
</div>

<style>
	.space-needle-hero,
	.space-needle-hero__canvas,
	.space-needle-hero__glow {
		position: absolute;
		inset: 0;
	}

	.space-needle-hero {
		overflow: hidden;
		background:
			radial-gradient(circle at 38% 38%, rgba(255, 181, 145, 0.22), transparent 28%),
			radial-gradient(circle at 64% 58%, rgba(87, 105, 255, 0.18), transparent 30%),
			linear-gradient(180deg, #2a0d15 0%, #100914 100%);
	}

	.space-needle-hero--sized {
		position: relative;
		inset: auto;
		max-width: 100vw;
		max-height: 100vw;
	}

	.space-needle-hero--overlay {
		background: transparent;
	}

	.space-needle-hero__canvas {
		z-index: 1;
		cursor: grab;
		touch-action: none;
	}

	.space-needle-hero__canvas:active {
		cursor: grabbing;
	}

	.space-needle-hero__canvas :global(canvas) {
		display: block;
		width: 100% !important;
		height: 100% !important;
	}

	.space-needle-hero__glow {
		z-index: 2;
		background:
			radial-gradient(
				circle at 48% 48%,
				transparent 0 18%,
				rgba(255, 139, 99, 0.16) 42%,
				transparent 68%
			),
			linear-gradient(90deg, rgba(255, 255, 255, 0.1), transparent 24% 100%);
		mix-blend-mode: screen;
		pointer-events: none;
	}

	.space-needle-hero--overlay .space-needle-hero__glow {
		background:
			radial-gradient(
				circle at 50% 46%,
				transparent 0 22%,
				rgba(255, 232, 217, 0.16) 46%,
				transparent 72%
			),
			linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12) 58%, transparent 100%);
	}
</style>
