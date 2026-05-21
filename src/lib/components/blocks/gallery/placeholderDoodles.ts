import * as THREE from 'three';

export type PlaceholderDoodle = {
	id: string;
	author: string;
	title: string;
};

export const placeholderDoodles: PlaceholderDoodle[] = [
	{ id: 'sunflower', author: 'guest_042', title: 'Sunflower Scribble' },
	{ id: 'rocket', author: 'guest_107', title: 'Tiny Rocket' },
	{ id: 'cat', author: 'guest_019', title: 'Sleepy Cat' },
	{ id: 'waves', author: 'guest_088', title: 'Ocean Waves' },
	{ id: 'stars', author: 'guest_033', title: 'Night Sky' }
];

function seededRandom(seed: number) {
	let value = seed;

	return () => {
		value = (value * 1664525 + 1013904223) % 4294967296;
		return value / 4294967296;
	};
}

function drawDoodle(
	context: CanvasRenderingContext2D,
	size: number,
	seed: number,
	palette: string[]
) {
	const random = seededRandom(seed);
	const paper = '#fffef6';
	const margin = size * 0.12;

	context.fillStyle = paper;
	context.fillRect(0, 0, size, size);

	context.lineCap = 'round';
	context.lineJoin = 'round';

	const strokeCount = 4 + Math.floor(random() * 5);

	for (let index = 0; index < strokeCount; index += 1) {
		context.strokeStyle = palette[Math.floor(random() * palette.length)];
		context.lineWidth = 2 + random() * 5;
		context.beginPath();

		const startX = margin + random() * (size - margin * 2);
		const startY = margin + random() * (size - margin * 2);
		context.moveTo(startX, startY);

		const segments = 3 + Math.floor(random() * 4);
		for (let segment = 0; segment < segments; segment += 1) {
			const controlX = margin + random() * (size - margin * 2);
			const controlY = margin + random() * (size - margin * 2);
			const endX = margin + random() * (size - margin * 2);
			const endY = margin + random() * (size - margin * 2);
			context.quadraticCurveTo(controlX, controlY, endX, endY);
		}

		context.stroke();
	}

	if (seed % 3 === 0) {
		context.fillStyle = palette[0];
		context.beginPath();
		context.arc(size * 0.5, size * 0.46, size * 0.12, 0, Math.PI * 2);
		context.fill();
		context.strokeStyle = palette[1];
		context.lineWidth = 3;
		context.beginPath();
		context.arc(size * 0.42, size * 0.42, size * 0.015, 0, Math.PI * 2);
		context.arc(size * 0.58, size * 0.42, size * 0.015, 0, Math.PI * 2);
		context.stroke();
		context.beginPath();
		context.arc(size * 0.5, size * 0.5, size * 0.05, 0.15 * Math.PI, 0.85 * Math.PI);
		context.stroke();
	}

	if (seed % 3 === 1) {
		context.strokeStyle = palette[2];
		context.lineWidth = 4;
		for (let ray = 0; ray < 8; ray += 1) {
			const angle = (ray / 8) * Math.PI * 2;
			context.beginPath();
			context.moveTo(size * 0.5, size * 0.34);
			context.lineTo(
				size * 0.5 + Math.cos(angle) * size * 0.16,
				size * 0.34 + Math.sin(angle) * size * 0.16
			);
			context.stroke();
		}
	}

	if (seed % 3 === 2) {
		context.strokeStyle = palette[0];
		context.lineWidth = 3;
		context.beginPath();
		for (let waveX = margin; waveX <= size - margin; waveX += 8) {
			const waveY = size * 0.58 + Math.sin(waveX * 0.04 + seed) * size * 0.05;
			if (waveX === margin) {
				context.moveTo(waveX, waveY);
			} else {
				context.lineTo(waveX, waveY);
			}
		}
		context.stroke();
	}
}

const doodlePalettes: Record<string, string[]> = {
	sunflower: ['#f4a127', '#2f6b3f', '#1f1f1f', '#ffe066'],
	rocket: ['#ff5d5d', '#3d5afe', '#1f1f1f', '#ffd166'],
	cat: ['#7b5ea7', '#ffb4a2', '#1f1f1f', '#ffd6e0'],
	waves: ['#0077b6', '#48cae4', '#1f1f1f', '#90e0ef'],
	stars: ['#ffd166', '#ef476f', '#1f1f1f', '#118ab2']
};

export function createPlaceholderDoodleCanvas(id: string, seed: number): HTMLCanvasElement {
	const canvas = document.createElement('canvas');
	const size = 512;
	canvas.width = size;
	canvas.height = size;

	const context = canvas.getContext('2d');
	if (!context) {
		return canvas;
	}

	drawDoodle(context, size, seed, doodlePalettes[id] ?? ['#ff6b6b', '#4ecdc4', '#1f1f1f', '#ffe66d']);
	return canvas;
}

export function createPlaceholderDoodleTexture(id: string, seed: number): THREE.CanvasTexture {
	const canvas = createPlaceholderDoodleCanvas(id, seed);

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	return texture;
}
