import { beforeEach, describe, expect, it } from 'vitest';

describe('hero3dParams', () => {
	beforeEach(async () => {
		const { resetHero3dParams } = await import('./hero3dParams.svelte');
		resetHero3dParams();
	});

	it('returns the current hero parameter snapshot', async () => {
		const { defaultHero3DParams, getHero3dParamsSnapshot } = await import('./hero3dParams.svelte');

		expect(getHero3dParamsSnapshot()).toEqual(defaultHero3DParams);
	});

	it('applies partial updates and merges prop overrides', async () => {
		const { getHero3dParamsSnapshot, mergeHero3dProps, setHero3dParams } = await import(
			'./hero3dParams.svelte'
		);

		setHero3dParams({
			revealRadius: 0.31,
			pixelSize: 0.28,
			glowStrength: 0.48,
			grainScale: 120
		});

		expect(getHero3dParamsSnapshot()).toMatchObject({
			revealRadius: 0.31,
			pixelSize: 0.28,
			glowStrength: 0.48,
			grainScale: 120
		});

		expect(
			mergeHero3dProps({
				revealOpacity: 0.74,
				pixelHardness: 0.88,
				bounceStrength: 0.51
			})
		).toMatchObject({
			revealRadius: 0.31,
			pixelSize: 0.28,
			glowStrength: 0.48,
			grainScale: 120,
			revealOpacity: 0.74,
			pixelHardness: 0.88,
			bounceStrength: 0.51
		});
	});

	it('applies presets and detects the active preset', async () => {
		const {
			applyHero3dPreset,
			getHero3dPreset,
			getHero3dParamsSnapshot,
			hero3dPresets,
			isHero3dPresetActive
		} = await import('./hero3dParams.svelte');

		expect(hero3dPresets.length).toBeGreaterThan(2);

		applyHero3dPreset('neon-arcade');

		const neonArcade = getHero3dPreset('neon-arcade');
		expect(neonArcade).toBeDefined();
		expect(getHero3dParamsSnapshot()).toEqual(neonArcade?.params);
		expect(isHero3dPresetActive(getHero3dParamsSnapshot(), 'neon-arcade')).toBe(true);
		expect(isHero3dPresetActive(getHero3dParamsSnapshot(), 'soft-frost')).toBe(false);
	});
});
