<script lang="ts">
	import { asset } from '$app/paths';
	import houstonDayPlate from '$lib/images/photos/houston-day.jpg';
	import houstonNightPlate from '$lib/images/photos/houston-night.png';
	import { theme } from '$lib/stores';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

	interface HoustonBlockProps {
		class?: string;
	}

	type RocketAnimation = {
		basePosition: THREE.Vector3;
		group: THREE.Group;
	};

	let { class: className }: HoustonBlockProps = $props();
	let hasScene = $state(false);
	let loadFailed = $state(false);
	let isDark = $derived($theme === 'dark');

	const rocketModel = asset('/simple_rocket.glb');

	function addUnique<T>(items: T[], item: T) {
		if (!items.includes(item)) items.push(item);
	}

	function disposeMaterialTexture(material: THREE.Material, key: keyof THREE.Material) {
		const value = material[key];

		if (value instanceof THREE.Texture) value.dispose();
	}

	function disposeObject(object: THREE.Object3D) {
		const geometries: THREE.BufferGeometry[] = [];
		const materials: THREE.Material[] = [];

		object.traverse((child) => {
			if (!(child instanceof THREE.Mesh)) return;

			addUnique(geometries, child.geometry);
			if (Array.isArray(child.material)) {
				child.material.forEach((material) => addUnique(materials, material));
			} else {
				addUnique(materials, child.material);
			}
		});

		geometries.forEach((geometry) => geometry.dispose());
		materials.forEach((material) => {
			for (const key of Object.keys(material) as (keyof THREE.Material)[]) {
				disposeMaterialTexture(material, key);
			}
			material.dispose();
		});
	}

	function prepareRocket(rocket: THREE.Object3D) {
		rocket.traverse((child) => {
			if (!(child instanceof THREE.Mesh)) return;

			child.castShadow = true;
			child.receiveShadow = true;
			child.material = Array.isArray(child.material)
				? child.material.map((material) => prepareMaterial(material))
				: prepareMaterial(child.material);
		});
	}

	function prepareMaterial(material: THREE.Material) {
		const next = material.clone();

		if (next instanceof THREE.MeshStandardMaterial) {
			next.roughness = Math.max(next.roughness, 0.52);
			next.metalness = Math.min(next.metalness, 0.22);
			next.envMapIntensity = 0.42;
		}

		return next;
	}

	function normalizeRocket(rocket: THREE.Object3D, targetHeight: number) {
		const bounds = new THREE.Box3().setFromObject(rocket);
		const size = bounds.getSize(new THREE.Vector3());
		const center = bounds.getCenter(new THREE.Vector3());
		const height = Math.max(size.y, size.x, size.z, 1);

		rocket.position.sub(center);
		rocket.scale.setScalar(targetHeight / height);
	}

	function setupRocketStage(canvas: HTMLCanvasElement) {
		let frame = 0;
		let lastTime = performance.now();
		let disposed = false;
		let sourceModel: THREE.Group | null = null;
		const animatedRockets: RocketAnimation[] = [];

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
		camera.position.set(0, 0.15, 8);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			canvas,
			powerPreference: 'high-performance'
		});
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		renderer.setClearColor(0x000000, 0);

		const root = new THREE.Group();
		scene.add(root);

		const ambientLight = new THREE.HemisphereLight('#ffe5b4', '#7da8ff', 2.7);
		scene.add(ambientLight);

		const keyLight = new THREE.DirectionalLight('#fff1c7', 4);
		keyLight.position.set(-3, 4, 5);
		scene.add(keyLight);

		const rimLight = new THREE.DirectionalLight('#74b9ff', 2);
		rimLight.position.set(3, 2, -4);
		scene.add(rimLight);

		const resize = () => {
			const { width, height } = canvas.getBoundingClientRect();
			if (width <= 0 || height <= 0) return;

			renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
			renderer.setSize(width, height, false);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		};

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(canvas);
		resize();

		const loader = new GLTFLoader();
		loader.load(
			rocketModel,
			(gltf) => {
				if (disposed) {
					disposeObject(gltf.scene);
					return;
				}

				sourceModel = gltf.scene;

				const rocket = sourceModel.clone(true);
				const group = new THREE.Group();

				prepareRocket(rocket);
				normalizeRocket(rocket, 3.3);

				group.position.set(1.05, -0.08, -0.2);
				group.rotation.set(-0.18, -0.46, -0.32);
				group.add(rocket);
				root.add(group);

				animatedRockets.push({
					basePosition: group.position.clone(),
					group
				});

				hasScene = true;
			},
			undefined,
			() => {
				loadFailed = true;
			}
		);

		const render = (time: number) => {
			const delta = Math.min((time - lastTime) / 1000, 0.05);
			const seconds = time / 1000;
			lastTime = time;

			for (const rocket of animatedRockets) {
				rocket.group.position.y = rocket.basePosition.y + Math.sin(seconds * 0.82) * 0.12;
				rocket.group.rotation.y += 0.34 * delta;
				rocket.group.rotation.z = -0.32 + Math.sin(seconds * 0.62) * 0.035;
			}

			renderer.render(scene, camera);
			frame = requestAnimationFrame(render);
		};

		frame = requestAnimationFrame(render);

		return () => {
			disposed = true;
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			disposeObject(root);
			if (sourceModel) disposeObject(sourceModel);
			renderer.dispose();
		};
	}
</script>

<div class={['houston-block', className]}>
	<img
		src={houstonDayPlate}
		alt="Houston skyline during daytime"
		class="houston-block__image"
		class:visible={!isDark}
		aria-hidden={isDark}
	/>

	<img
		src={houstonNightPlate}
		alt="Houston skyline at night"
		class="houston-block__image"
		class:visible={isDark}
		aria-hidden={!isDark}
	/>

	<div class="houston-block__stage" class:houston-block__stage--ready={hasScene} aria-hidden="true">
		<canvas {@attach setupRocketStage} class="houston-block__canvas"></canvas>
		{#if loadFailed}
			<div class="houston-block__fallback"></div>
		{/if}
	</div>

	<div class="houston-block__scrim" aria-hidden="true"></div>

	<div class="houston-block__label">
		<span class="font-serif text-xl text-white drop-shadow-lg">Home</span>
		<span class="font-serif text-lg text-white/90 drop-shadow-lg">Houston, TX</span>
	</div>
</div>

<style>
	.houston-block {
		position: relative;
		min-height: min(22rem, calc(100vw - 2rem));
		overflow: hidden;
		border: 1px solid var(--border-color);
		border-radius: 1.5rem;
		background: #0b1b2c;
		isolation: isolate;
	}

	.houston-block__image,
	.houston-block__stage,
	.houston-block__scrim,
	.houston-block__fallback {
		position: absolute;
		inset: 0;
	}

	.houston-block__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 44% center;
		filter: saturate(1.05) contrast(1.05);
		opacity: 0;
		transition: opacity 0.6s ease-in-out;
	}

	.houston-block__image.visible {
		opacity: 1;
	}

	.houston-block__stage {
		z-index: 10;
		pointer-events: none;
		filter: drop-shadow(0 1.75rem 2rem rgb(0 0 0 / 0.42));
	}

	.houston-block__canvas {
		display: block;
		width: 100%;
		height: 100%;
		opacity: 0;
		transition: opacity 420ms ease;
	}

	.houston-block__stage--ready .houston-block__canvas {
		opacity: 1;
	}

	.houston-block__fallback {
		background:
			radial-gradient(circle at 64% 36%, rgb(255 245 197 / 0.22), transparent 32%),
			radial-gradient(circle at 72% 58%, rgb(82 163 255 / 0.18), transparent 26%);
	}

	.houston-block__scrim {
		z-index: 20;
		background:
			linear-gradient(180deg, rgb(4 17 31 / 0.28), transparent 34%),
			linear-gradient(0deg, rgb(1 8 15 / 0.72), rgb(1 8 15 / 0.18) 54%, transparent),
			linear-gradient(90deg, rgb(1 8 15 / 0.56), transparent 58%);
		pointer-events: none;
	}

	.houston-block__label {
		position: absolute;
		inset: 0;
		z-index: 30;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		padding: 1.25rem;
		pointer-events: none;
	}

	@media (min-width: 48rem) {
		.houston-block {
			min-height: 100%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.houston-block__canvas {
			transition: none;
		}
	}
</style>
