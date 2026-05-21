import * as THREE from 'three';
import { createPlaceholderDoodleCanvas, placeholderDoodles, type PlaceholderDoodle } from './placeholderDoodles';
import {
	composeVintageFramedArt,
	preloadVintageFrameImages,
	vintageFrameAssets,
	type VintageFrameStyle
} from './vintageFrameTextures';

export type GalleryFrameConfig = {
	doodle: PlaceholderDoodle;
	position: THREE.Vector3;
	rotation: number;
	scale: number;
	seed: number;
	frameStyle: VintageFrameStyle;
};

export const galleryFrameConfigs: GalleryFrameConfig[] = [
	{
		doodle: placeholderDoodles[0],
		position: new THREE.Vector3(-2.35, 0.42, -0.08),
		rotation: 0.04,
		scale: 1,
		seed: 11,
		frameStyle: 'gilded'
	},
	{
		doodle: placeholderDoodles[1],
		position: new THREE.Vector3(-1.15, 0.08, 0.06),
		rotation: -0.03,
		scale: 0.92,
		seed: 23,
		frameStyle: 'rosewood'
	},
	{
		doodle: placeholderDoodles[2],
		position: new THREE.Vector3(0.05, 0.52, -0.12),
		rotation: 0.015,
		scale: 1.08,
		seed: 37,
		frameStyle: 'gilded'
	},
	{
		doodle: placeholderDoodles[3],
		position: new THREE.Vector3(1.25, 0.18, 0.04),
		rotation: -0.05,
		scale: 0.96,
		seed: 41,
		frameStyle: 'silver'
	},
	{
		doodle: placeholderDoodles[4],
		position: new THREE.Vector3(2.45, 0.36, -0.06),
		rotation: 0.035,
		scale: 1.02,
		seed: 53,
		frameStyle: 'rosewood'
	}
];

function addUnique<T>(items: T[], item: T) {
	if (!items.includes(item)) items.push(item);
}

function drawRoundedRect(
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number
) {
	const corner = Math.min(radius, width / 2, height / 2);
	context.beginPath();
	context.moveTo(x + corner, y);
	context.lineTo(x + width - corner, y);
	context.quadraticCurveTo(x + width, y, x + width, y + corner);
	context.lineTo(x + width, y + height - corner);
	context.quadraticCurveTo(x + width, y + height, x + width - corner, y + height);
	context.lineTo(x + corner, y + height);
	context.quadraticCurveTo(x, y + height, x, y + height - corner);
	context.lineTo(x, y + corner);
	context.quadraticCurveTo(x, y, x + corner, y);
	context.closePath();
}

function createNamePlaqueTexture(doodle: PlaceholderDoodle): THREE.CanvasTexture {
	const canvas = document.createElement('canvas');
	const width = 512;
	const height = 144;
	canvas.width = width;
	canvas.height = height;

	const context = canvas.getContext('2d');
	if (!context) {
		return new THREE.CanvasTexture(canvas);
	}

	drawRoundedRect(context, 18, 18, width - 36, height - 36, 10);
	context.fillStyle = '#1a1410';
	context.fill();

	const plaqueGradient = context.createLinearGradient(0, 24, 0, height - 24);
	plaqueGradient.addColorStop(0, '#a8894f');
	plaqueGradient.addColorStop(0.45, '#d4b06a');
	plaqueGradient.addColorStop(1, '#6f5430');
	drawRoundedRect(context, 28, 28, width - 56, height - 56, 8);
	context.fillStyle = plaqueGradient;
	context.fill();

	context.strokeStyle = '#f2dfb0';
	context.lineWidth = 2.5;
	drawRoundedRect(context, 28, 28, width - 56, height - 56, 8);
	context.stroke();

	context.textAlign = 'center';
	context.fillStyle = '#17120e';
	context.font = '600 26px Georgia, "Times New Roman", serif';
	context.fillText(doodle.title, width / 2, 66);

	context.fillStyle = 'rgb(23 18 14 / 0.78)';
	context.font = '500 18px Georgia, "Times New Roman", serif';
	context.fillText(doodle.author, width / 2, 96);

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	return texture;
}

export function disposeObject(object: THREE.Object3D) {
	const geometries: THREE.BufferGeometry[] = [];
	const materials: THREE.Material[] = [];
	const textures: THREE.Texture[] = [];

	object.traverse((child) => {
		if (!(child instanceof THREE.Mesh)) return;

		addUnique(geometries, child.geometry);
		const meshMaterials = Array.isArray(child.material) ? child.material : [child.material];
		for (const material of meshMaterials) {
			addUnique(materials, material);
			for (const key of Object.keys(material) as (keyof THREE.Material)[]) {
				const value = material[key];
				if (value instanceof THREE.Texture) addUnique(textures, value);
			}
		}
	});

	geometries.forEach((geometry) => geometry.dispose());
	textures.forEach((texture) => texture.dispose());
	materials.forEach((material) => material.dispose());
}

function createVintageFrame(
	config: GalleryFrameConfig,
	frameImages: Record<VintageFrameStyle, HTMLImageElement>
) {
	const group = new THREE.Group();
	const frameAsset = vintageFrameAssets[config.frameStyle];
	const frameImage = frameImages[config.frameStyle];
	const artCanvas = createPlaceholderDoodleCanvas(config.doodle.id, config.seed);
	const composedCanvas = composeVintageFramedArt(frameImage, artCanvas, frameAsset);

	const texture = new THREE.CanvasTexture(composedCanvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;

	const aspect = composedCanvas.width / composedCanvas.height;
	const displayHeight = 0.88 * config.scale;
	const displayWidth = displayHeight * aspect;

	const backing = new THREE.Mesh(
		new THREE.PlaneGeometry(displayWidth * 1.015, displayHeight * 1.015),
		new THREE.MeshStandardMaterial({ color: '#0c090f', roughness: 1, metalness: 0 })
	);
	backing.position.z = -0.03;
	backing.receiveShadow = true;
	group.add(backing);

	const framedArt = new THREE.Mesh(
		new THREE.PlaneGeometry(displayWidth, displayHeight),
		new THREE.MeshStandardMaterial({
			map: texture,
			roughness: 0.78,
			metalness: config.frameStyle === 'gilded' ? 0.18 : 0.04
		})
	);
	framedArt.castShadow = true;
	framedArt.receiveShadow = true;
	group.add(framedArt);

	const plaqueTexture = createNamePlaqueTexture(config.doodle);
	const plaqueAspect = 512 / 144;
	const plaqueWidth = displayWidth * 0.68;
	const plaqueHeight = plaqueWidth / plaqueAspect;
	const plaque = new THREE.Mesh(
		new THREE.PlaneGeometry(plaqueWidth, plaqueHeight),
		new THREE.MeshStandardMaterial({
			map: plaqueTexture,
			roughness: 0.72,
			metalness: 0.34,
			emissive: '#2a2118',
			emissiveIntensity: 0.06
		})
	);
	plaque.position.set(0, -displayHeight / 2 - plaqueHeight / 2 - 0.05 * config.scale, 0.02);
	plaque.castShadow = true;
	plaque.receiveShadow = true;
	group.add(plaque);

	group.position.copy(config.position);
	group.rotation.z = config.rotation;
	group.userData.doodle = config.doodle;
	group.userData.baseRotation = config.rotation;

	return group;
}

export function buildGalleryScene(
	root: THREE.Group,
	frameImages: Record<VintageFrameStyle, HTMLImageElement>
) {
	const wallMaterial = new THREE.MeshStandardMaterial({
		color: '#2f2438',
		roughness: 0.94,
		metalness: 0.02
	});
	const floorMaterial = new THREE.MeshStandardMaterial({
		color: '#17121d',
		roughness: 0.82,
		metalness: 0.08
	});
	const ceilingMaterial = new THREE.MeshStandardMaterial({
		color: '#241c2d',
		roughness: 0.96,
		metalness: 0.01
	});

	const wall = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 4.2), wallMaterial);
	wall.position.set(0, 0.35, -0.35);
	wall.receiveShadow = true;
	root.add(wall);

	const wainscot = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 1.1), new THREE.MeshStandardMaterial({
		color: '#45344f',
		roughness: 0.88,
		metalness: 0.04
	}));
	wainscot.position.set(0, -1.05, -0.34);
	root.add(wainscot);

	const floor = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 5.5), floorMaterial);
	floor.rotation.x = -Math.PI / 2;
	floor.position.set(0, -1.55, 1.8);
	floor.receiveShadow = true;
	root.add(floor);

	const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 5.5), ceilingMaterial);
	ceiling.rotation.x = Math.PI / 2;
	ceiling.position.set(0, 2.35, 1.8);
	root.add(ceiling);

	const railMaterial = new THREE.MeshStandardMaterial({
		color: '#d4af37',
		metalness: 0.86,
		roughness: 0.24
	});
	const rail = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.05, 0.08), railMaterial);
	rail.position.set(0, -0.42, -0.18);
	root.add(rail);

	for (const config of galleryFrameConfigs) {
		root.add(createVintageFrame(config, frameImages));
	}

	const spotlightTargets = galleryFrameConfigs.map((config) => config.position.clone().add(new THREE.Vector3(0, 0, 0.2)));

	spotlightTargets.forEach((target, index) => {
		const light = new THREE.SpotLight('#fff2d6', 18, 8, Math.PI / 5.5, 0.35, 1.1);
		light.position.set(target.x * 0.35, 2.1 + (index % 2) * 0.08, 2.4);
		light.target.position.copy(target);
		light.castShadow = index === 2;
		root.add(light);
		root.add(light.target);
	});

	const ambient = new THREE.HemisphereLight('#fff0d9', '#24182d', 1.35);
	root.add(ambient);

	const fill = new THREE.DirectionalLight('#c7d2fe', 1.1);
	fill.position.set(-2.5, 1.5, 3.5);
	root.add(fill);

	return root;
}

export type GallerySceneController = {
	pan: (deltaX: number, deltaY: number) => void;
	zoom: (deltaY: number) => void;
	dispose: () => void;
};

const LOOK_AT_Y = 0.28;
const LOOK_AT_Z = -0.35;
const BASE_CAMERA_Y = 0.35;
const DEFAULT_CAMERA_Z = 4.15;
const MIN_CAMERA_Z = 0.95;
const MAX_CAMERA_Z = 7.8;
const MAX_PAN_X = 3.2;
const MAX_PAN_Y = 1.5;

export async function setupGalleryScene(canvas: HTMLCanvasElement): Promise<GallerySceneController> {
	const frameImages = await preloadVintageFrameImages();
	let frame = 0;
	let lastTime = performance.now();
	let panX = 0;
	let panY = 0;
	let cameraZ = DEFAULT_CAMERA_Z;

	const prefersReducedMotion =
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const scene = new THREE.Scene();
	scene.fog = new THREE.Fog('#17121d', 4.5, 11);

	const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 20);

	const renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true,
		canvas,
		powerPreference: 'high-performance'
	});
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.setClearColor(0x000000, 0);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	const root = new THREE.Group();
	scene.add(root);
	buildGalleryScene(root, frameImages);

	const applyCamera = () => {
		camera.position.set(panX, BASE_CAMERA_Y + panY, cameraZ);
		camera.lookAt(panX, LOOK_AT_Y + panY, LOOK_AT_Z);
	};

	const resize = () => {
		const { width, height } = canvas.getBoundingClientRect();
		if (width <= 0 || height <= 0) return;

		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	};

	const onWheel = (event: WheelEvent) => {
		event.preventDefault();
		const factor = Math.exp(event.deltaY * 0.00135);
		cameraZ = THREE.MathUtils.clamp(cameraZ * factor, MIN_CAMERA_Z, MAX_CAMERA_Z);
	};

	const resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(canvas);
	canvas.addEventListener('wheel', onWheel, { passive: false });
	resize();
	applyCamera();

	const render = (time: number) => {
		const delta = Math.min((time - lastTime) / 1000, 0.05);
		const seconds = time / 1000;
		lastTime = time;

		applyCamera();

		if (!prefersReducedMotion) {
			root.children.forEach((child, index) => {
				if (!(child instanceof THREE.Group) || child.userData.baseRotation === undefined) return;
				child.rotation.z =
					child.userData.baseRotation + Math.sin(seconds * 0.55 + index) * 0.004;
			});
		}

		renderer.render(scene, camera);
		frame = requestAnimationFrame(render);
	};

	frame = requestAnimationFrame(render);

	return {
		pan(deltaX, deltaY) {
			const scale = cameraZ * 0.0016;
			panX = THREE.MathUtils.clamp(panX - deltaX * scale, -MAX_PAN_X, MAX_PAN_X);
			panY = THREE.MathUtils.clamp(panY + deltaY * scale, -MAX_PAN_Y, MAX_PAN_Y);
		},
		zoom(deltaY) {
			const factor = Math.exp(deltaY * 0.00135);
			cameraZ = THREE.MathUtils.clamp(cameraZ * factor, MIN_CAMERA_Z, MAX_CAMERA_Z);
		},
		dispose() {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			canvas.removeEventListener('wheel', onWheel);
			disposeObject(root);
			renderer.dispose();
		}
	};
}
