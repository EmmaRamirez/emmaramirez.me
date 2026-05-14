<script lang="ts">
	import { asset } from '$app/paths';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

	type Props = {
		mode?: 'tile' | 'page';
		side?: 'left' | 'right' | 'both';
	};

	type ColumnAnimation = {
		basePosition: THREE.Vector3;
		bob: number;
		group: THREE.Group;
		spinX: number;
	};

	let { mode = 'tile', side = 'both' }: Props = $props();
	let hasScene = $state(false);
	let loadFailed = $state(false);

	const columnModel = asset('/greek_doric_column.glb');
	const isAnimated = $derived(mode === 'page');

	const columnConfigs = $derived(
		mode === 'page'
			? side === 'left'
				? [
						{
							position: new THREE.Vector3(0, 0.35, -0.18),
							rotation: new THREE.Euler(0.1, 0.08, -0.28),
							scale: 2.9,
							spinX: 0.018,
							bob: 0.052
						}
					]
				: side === 'right'
					? [
							{
								position: new THREE.Vector3(0, 0.35, -0.18),
								rotation: new THREE.Euler(-0.08, -0.08, 0.28),
								scale: 2.9,
								spinX: -0.018,
								bob: 0.052
							}
						]
					: [
							{
								position: new THREE.Vector3(-1.9, 0.24, -0.24),
								rotation: new THREE.Euler(0.08, 0.04, -0.24),
								scale: 3,
								spinX: 0.024,
								bob: 0.075
							},
							{
								position: new THREE.Vector3(1.9, 0.22, -0.3),
								rotation: new THREE.Euler(-0.06, -0.04, 0.24),
								scale: 3.04,
								spinX: -0.022,
								bob: 0.068
							}
						]
			: side === 'left'
				? [
						{
							position: new THREE.Vector3(0, -0.24, -0.24),
							rotation: new THREE.Euler(0.08, 0.03, -0.08),
							scale: 3.28,
							spinX: 0,
							bob: 0
						}
					]
				: side === 'right'
					? [
							{
								position: new THREE.Vector3(0, -0.24, -0.24),
								rotation: new THREE.Euler(0.08, -0.03, 0.08),
								scale: 3.28,
								spinX: 0,
								bob: 0
							}
						]
					: [
							{
								position: new THREE.Vector3(-2.25, -0.24, -0.24),
								rotation: new THREE.Euler(0.08, 0.03, -0.08),
								scale: 3.28,
								spinX: 0,
								bob: 0
							},
							{
								position: new THREE.Vector3(2.25, -0.24, -0.24),
								rotation: new THREE.Euler(0.08, -0.03, 0.08),
								scale: 3.28,
								spinX: 0,
								bob: 0
							}
						]
	);

	function addUnique<T>(items: T[], item: T) {
		if (!items.includes(item)) items.push(item);
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
		materials.forEach((material) => material.dispose());
	}

	function prepareColumn(column: THREE.Object3D) {
		column.traverse((child) => {
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
			next.color.lerp(new THREE.Color('#d7c39a'), 0.42);
			next.roughness = Math.max(next.roughness, 0.78);
			next.metalness = Math.min(next.metalness, 0.06);
			next.envMapIntensity = 0.22;
		}

		return next;
	}

	function normalizeColumn(column: THREE.Object3D, targetHeight: number) {
		const bounds = new THREE.Box3().setFromObject(column);
		const size = bounds.getSize(new THREE.Vector3());
		const center = bounds.getCenter(new THREE.Vector3());
		const height = Math.max(size.y, size.x, size.z, 1);

		column.position.sub(center);
		column.scale.setScalar(targetHeight / height);
	}

	function setupDoricStage(canvas: HTMLCanvasElement) {
		let frame: number | undefined;
		let lastTime = performance.now();
		let disposed = false;
		let sourceModel: THREE.Group | null = null;
		const animatedColumns: ColumnAnimation[] = [];

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
		camera.position.set(0, 0.2, mode === 'page' ? 9.8 : 8.25);

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

		const renderScene = () => {
			renderer.render(scene, camera);
		};

		const ambientLight = new THREE.HemisphereLight('#fff4d3', '#657957', 2.6);
		scene.add(ambientLight);

		const keyLight = new THREE.DirectionalLight('#fff1bc', 4.2);
		keyLight.position.set(-3, 4, 5);
		scene.add(keyLight);

		const fillLight = new THREE.DirectionalLight('#9fba70', 1.1);
		fillLight.position.set(4, -1, 2);
		scene.add(fillLight);

		const resize = () => {
			const { width, height } = canvas.getBoundingClientRect();
			if (width <= 0 || height <= 0) return;

			renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
			renderer.setSize(width, height, false);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			if (!isAnimated) renderScene();
		};

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(canvas);
		resize();

		const loader = new GLTFLoader();
		loader.load(
			columnModel,
			(gltf) => {
				if (disposed) {
					disposeObject(gltf.scene);
					return;
				}

				sourceModel = gltf.scene;

				for (const config of columnConfigs) {
					const column = sourceModel.clone(true);
					const group = new THREE.Group();

					prepareColumn(column);
					normalizeColumn(column, config.scale);

					group.position.copy(config.position);
					group.rotation.copy(config.rotation);
					group.add(column);
					root.add(group);

					animatedColumns.push({
						basePosition: config.position.clone(),
						bob: config.bob,
						group,
						spinX: config.spinX
					});
				}

				hasScene = true;
				if (!isAnimated) renderScene();
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

			for (const [index, column] of animatedColumns.entries()) {
				column.group.position.y =
					column.basePosition.y + Math.sin(seconds * 0.7 + index * 1.7) * column.bob;
				column.group.rotation.x += column.spinX * delta;
			}

			renderer.render(scene, camera);
			frame = requestAnimationFrame(render);
		};

		if (isAnimated) {
			frame = requestAnimationFrame(render);
		}

		return () => {
			disposed = true;
			if (frame !== undefined) cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			disposeObject(root);
			if (sourceModel) disposeObject(sourceModel);
			renderer.dispose();
		};
	}
</script>

<div
	class={['doric-stage', `doric-stage--${mode}`, hasScene && 'doric-stage--ready']}
	aria-hidden="true"
>
	<canvas {@attach setupDoricStage} class="doric-stage__canvas"></canvas>
	{#if loadFailed}
		<div class="doric-stage__fallback"></div>
	{/if}
</div>

<style>
	.doric-stage {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.doric-stage__canvas,
	.doric-stage__fallback {
		position: absolute;
		inset: 0;
	}

	.doric-stage__canvas {
		display: block;
		width: 100%;
		height: 100%;
		opacity: 0;
		transition: opacity 420ms ease;
	}

	.doric-stage--ready .doric-stage__canvas {
		opacity: 1;
	}

	.doric-stage__fallback {
		background:
			linear-gradient(90deg, transparent 0 12%, rgba(151, 126, 61, 0.18) 12% 16%, transparent 16%),
			linear-gradient(270deg, transparent 0 12%, rgba(65, 102, 58, 0.18) 12% 16%, transparent 16%);
		opacity: 0.8;
	}

	.doric-stage--tile {
		filter: saturate(0.92) sepia(0.12);
	}

	.doric-stage--page {
		filter: saturate(0.86) sepia(0.18);
	}

	@media (prefers-reduced-motion: reduce) {
		.doric-stage__canvas {
			transition: none;
		}
	}
</style>
