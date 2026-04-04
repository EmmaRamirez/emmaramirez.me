import { json } from '@sveltejs/kit';
import type { Prisma } from '$generated/prisma/client';
import { defaultDiscoParams, type DiscoParams } from '$lib/registry/discoParams';
import { prisma } from '$lib/server/prisma';
import { defaultHero3DParams, type Hero3DParams } from '$lib/stores/hero3dParams.svelte';

const SETTINGS_KEY = 'default';
const DISCO_PARAMS_KEY = '__discoParams';

type Hero3DParamsPayload = Hero3DParams;
type DiscoParamsPayload = DiscoParams;

type DebugSettingsPayload = {
	headerBlendMode: string;
	showSectionsEnabled: boolean;
	hero3dParams: Hero3DParamsPayload;
	discoParams?: DiscoParamsPayload;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function readNumber(record: Record<string, unknown>, key: string, fallback: number) {
	const value = record[key];
	return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizeHero3DParams(value: unknown): Hero3DParamsPayload {
	const record = isRecord(value) ? value : {};

	return {
		depthScale: readNumber(record, 'depthScale', defaultHero3DParams.depthScale),
		revealRadius: readNumber(record, 'revealRadius', defaultHero3DParams.revealRadius),
		parallaxXY: readNumber(record, 'parallaxXY', defaultHero3DParams.parallaxXY),
		parallaxZ: readNumber(record, 'parallaxZ', defaultHero3DParams.parallaxZ),
		splatStretch: readNumber(record, 'splatStretch', defaultHero3DParams.splatStretch),
		splatCompress: readNumber(record, 'splatCompress', defaultHero3DParams.splatCompress),
		depthBulge: readNumber(record, 'depthBulge', defaultHero3DParams.depthBulge),
		contourOffset: readNumber(record, 'contourOffset', defaultHero3DParams.contourOffset),
		blobAmplitude: readNumber(record, 'blobAmplitude', defaultHero3DParams.blobAmplitude),
		noiseAmplitude: readNumber(record, 'noiseAmplitude', defaultHero3DParams.noiseAmplitude),
		contourInfluence: readNumber(
			record,
			'contourInfluence',
			defaultHero3DParams.contourInfluence
		),
		edgeSoftness: readNumber(record, 'edgeSoftness', defaultHero3DParams.edgeSoftness),
		saturationBoost: readNumber(
			record,
			'saturationBoost',
			defaultHero3DParams.saturationBoost
		),
		contrastBoost: readNumber(record, 'contrastBoost', defaultHero3DParams.contrastBoost),
		rippleSpeed: readNumber(record, 'rippleSpeed', defaultHero3DParams.rippleSpeed),
		rippleFrequency: readNumber(record, 'rippleFrequency', defaultHero3DParams.rippleFrequency),
		rippleAmplitude: readNumber(record, 'rippleAmplitude', defaultHero3DParams.rippleAmplitude),
		causticScale: readNumber(record, 'causticScale', defaultHero3DParams.causticScale),
		causticSpeed: readNumber(record, 'causticSpeed', defaultHero3DParams.causticSpeed),
		causticIntensity: readNumber(
			record,
			'causticIntensity',
			defaultHero3DParams.causticIntensity
		),
		waterDistortion: readNumber(
			record,
			'waterDistortion',
			defaultHero3DParams.waterDistortion
		),
		mouseDamping: readNumber(record, 'mouseDamping', defaultHero3DParams.mouseDamping),
		revealDamping: readNumber(record, 'revealDamping', defaultHero3DParams.revealDamping),
		mouseRangeX: readNumber(record, 'mouseRangeX', defaultHero3DParams.mouseRangeX),
		mouseRangeY: readNumber(record, 'mouseRangeY', defaultHero3DParams.mouseRangeY),
		depthFocusNear: readNumber(
			record,
			'depthFocusNear',
			defaultHero3DParams.depthFocusNear
		),
		depthFocusFar: readNumber(record, 'depthFocusFar', defaultHero3DParams.depthFocusFar),
		depthMixLow: readNumber(record, 'depthMixLow', defaultHero3DParams.depthMixLow),
		parallaxXGain: readNumber(record, 'parallaxXGain', defaultHero3DParams.parallaxXGain),
		parallaxYGain: readNumber(record, 'parallaxYGain', defaultHero3DParams.parallaxYGain),
		rippleEdgeInfluence: readNumber(
			record,
			'rippleEdgeInfluence',
			defaultHero3DParams.rippleEdgeInfluence
		),
		edgeRippleStrength: readNumber(
			record,
			'edgeRippleStrength',
			defaultHero3DParams.edgeRippleStrength
		)
	};
}

function normalizeDiscoParams(value: unknown): DiscoParamsPayload {
	const record = isRecord(value) ? value : {};

	return {
		sampleHistorySize: readNumber(
			record,
			'sampleHistorySize',
			defaultDiscoParams.sampleHistorySize
		),
		minBeams: readNumber(record, 'minBeams', defaultDiscoParams.minBeams),
		maxBeams: readNumber(record, 'maxBeams', defaultDiscoParams.maxBeams),
		clickBeamCount: readNumber(record, 'clickBeamCount', defaultDiscoParams.clickBeamCount),
		clickBaseVolatility: readNumber(
			record,
			'clickBaseVolatility',
			defaultDiscoParams.clickBaseVolatility
		),
		volatilitySmoothing: readNumber(
			record,
			'volatilitySmoothing',
			defaultDiscoParams.volatilitySmoothing
		),
		volatilityDecay: readNumber(record, 'volatilityDecay', defaultDiscoParams.volatilityDecay)
	};
}

function getStoredDiscoParams(value: unknown) {
	if (!isRecord(value)) return undefined;
	return value[DISCO_PARAMS_KEY];
}

function serializeSettings(
	settings: Awaited<ReturnType<typeof prisma.debugSettings.findUnique>>
) {
	if (!settings) return null;

	return {
		...settings,
		hero3dParams: normalizeHero3DParams(settings.hero3dParams),
		discoParams: normalizeDiscoParams(getStoredDiscoParams(settings.hero3dParams))
	};
}

export const GET = async () => {
	try {
		const settings = await prisma.debugSettings.findUnique({
			where: { key: SETTINGS_KEY }
		});

		return json({ settings: serializeSettings(settings) });
	} catch (error) {
		console.error('[debug-settings] GET error:', error);
		return json(
			{ error: 'Failed to fetch debug settings', details: String(error) },
			{ status: 500 }
		);
	}
};

export const PUT = async ({ request }) => {
	try {
		const body = (await request.json()) as Partial<DebugSettingsPayload>;

		if (!body?.hero3dParams || typeof body.headerBlendMode !== 'string') {
			return json(
				{ error: 'Invalid payload: missing hero3dParams or headerBlendMode' },
				{ status: 400 }
			);
		}

		const existingSettings = await prisma.debugSettings.findUnique({
			where: { key: SETTINGS_KEY }
		});
		const hero3dParams = normalizeHero3DParams(body.hero3dParams);
		const discoParams = normalizeDiscoParams(
			body.discoParams ?? getStoredDiscoParams(existingSettings?.hero3dParams)
		);

		const storedDiscoParams: Prisma.InputJsonObject = {
			sampleHistorySize: discoParams.sampleHistorySize,
			minBeams: discoParams.minBeams,
			maxBeams: discoParams.maxBeams,
			clickBeamCount: discoParams.clickBeamCount,
			clickBaseVolatility: discoParams.clickBaseVolatility,
			volatilitySmoothing: discoParams.volatilitySmoothing,
			volatilityDecay: discoParams.volatilityDecay
		};
		const storedHero3dParams: Prisma.InputJsonObject = {
			depthScale: hero3dParams.depthScale,
			revealRadius: hero3dParams.revealRadius,
			parallaxXY: hero3dParams.parallaxXY,
			parallaxZ: hero3dParams.parallaxZ,
			splatStretch: hero3dParams.splatStretch,
			splatCompress: hero3dParams.splatCompress,
			depthBulge: hero3dParams.depthBulge,
			contourOffset: hero3dParams.contourOffset,
			blobAmplitude: hero3dParams.blobAmplitude,
			noiseAmplitude: hero3dParams.noiseAmplitude,
			contourInfluence: hero3dParams.contourInfluence,
			edgeSoftness: hero3dParams.edgeSoftness,
			saturationBoost: hero3dParams.saturationBoost,
			contrastBoost: hero3dParams.contrastBoost,
			rippleSpeed: hero3dParams.rippleSpeed,
			rippleFrequency: hero3dParams.rippleFrequency,
			rippleAmplitude: hero3dParams.rippleAmplitude,
			causticScale: hero3dParams.causticScale,
			causticSpeed: hero3dParams.causticSpeed,
			causticIntensity: hero3dParams.causticIntensity,
			waterDistortion: hero3dParams.waterDistortion,
			mouseDamping: hero3dParams.mouseDamping,
			revealDamping: hero3dParams.revealDamping,
			mouseRangeX: hero3dParams.mouseRangeX,
			mouseRangeY: hero3dParams.mouseRangeY,
			depthFocusNear: hero3dParams.depthFocusNear,
			depthFocusFar: hero3dParams.depthFocusFar,
			depthMixLow: hero3dParams.depthMixLow,
			parallaxXGain: hero3dParams.parallaxXGain,
			parallaxYGain: hero3dParams.parallaxYGain,
			rippleEdgeInfluence: hero3dParams.rippleEdgeInfluence,
			edgeRippleStrength: hero3dParams.edgeRippleStrength,
			[DISCO_PARAMS_KEY]: storedDiscoParams
		};

		const payload = {
			headerBlendMode: body.headerBlendMode,
			showSectionsEnabled: Boolean(body.showSectionsEnabled),
			hero3dParams: storedHero3dParams
		};

		const settings = await prisma.debugSettings.upsert({
			where: { key: SETTINGS_KEY },
			update: payload,
			create: {
				key: SETTINGS_KEY,
				...payload
			}
		});

		return json({ settings: serializeSettings(settings) });
	} catch (error) {
		console.error('[debug-settings] PUT error:', error);
		return json(
			{ error: 'Failed to save debug settings', details: String(error) },
			{ status: 500 }
		);
	}
};
