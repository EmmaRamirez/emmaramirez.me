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
		revealRadius: readNumber(record, 'revealRadius', defaultHero3DParams.revealRadius),
		revealSoftness: readNumber(record, 'revealSoftness', defaultHero3DParams.revealSoftness),
		revealOpacity: readNumber(record, 'revealOpacity', defaultHero3DParams.revealOpacity),
		pixelSize: readNumber(record, 'pixelSize', defaultHero3DParams.pixelSize),
		pixelHardness: readNumber(record, 'pixelHardness', defaultHero3DParams.pixelHardness),
		pixelScatter: readNumber(record, 'pixelScatter', defaultHero3DParams.pixelScatter),
		idleReveal: readNumber(record, 'idleReveal', defaultHero3DParams.idleReveal),
		cursorDamping: readNumber(record, 'cursorDamping', defaultHero3DParams.cursorDamping),
		revealDamping: readNumber(record, 'revealDamping', defaultHero3DParams.revealDamping),
		parallaxStrength: readNumber(
			record,
			'parallaxStrength',
			defaultHero3DParams.parallaxStrength
		),
		tiltStrength: readNumber(record, 'tiltStrength', defaultHero3DParams.tiltStrength),
		liftStrength: readNumber(record, 'liftStrength', defaultHero3DParams.liftStrength),
		rippleStrength: readNumber(record, 'rippleStrength', defaultHero3DParams.rippleStrength),
		rippleFrequency: readNumber(record, 'rippleFrequency', defaultHero3DParams.rippleFrequency),
		rippleSpeed: readNumber(record, 'rippleSpeed', defaultHero3DParams.rippleSpeed),
		rippleDecay: readNumber(record, 'rippleDecay', defaultHero3DParams.rippleDecay),
		bounceStrength: readNumber(record, 'bounceStrength', defaultHero3DParams.bounceStrength),
		bounceFrequency: readNumber(
			record,
			'bounceFrequency',
			defaultHero3DParams.bounceFrequency
		),
		bounceDecay: readNumber(record, 'bounceDecay', defaultHero3DParams.bounceDecay),
		fadeStrength: readNumber(record, 'fadeStrength', defaultHero3DParams.fadeStrength),
		fadeSoftness: readNumber(record, 'fadeSoftness', defaultHero3DParams.fadeSoftness),
		glowStrength: readNumber(record, 'glowStrength', defaultHero3DParams.glowStrength),
		glowRadius: readNumber(record, 'glowRadius', defaultHero3DParams.glowRadius),
		chromaStrength: readNumber(record, 'chromaStrength', defaultHero3DParams.chromaStrength),
		grainStrength: readNumber(record, 'grainStrength', defaultHero3DParams.grainStrength),
		grainScale: readNumber(record, 'grainScale', defaultHero3DParams.grainScale)
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

function serializeSettings(settings: Awaited<ReturnType<typeof prisma.debugSettings.findUnique>>) {
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
			revealRadius: hero3dParams.revealRadius,
			revealSoftness: hero3dParams.revealSoftness,
			revealOpacity: hero3dParams.revealOpacity,
			pixelSize: hero3dParams.pixelSize,
			pixelHardness: hero3dParams.pixelHardness,
			pixelScatter: hero3dParams.pixelScatter,
			idleReveal: hero3dParams.idleReveal,
			cursorDamping: hero3dParams.cursorDamping,
			revealDamping: hero3dParams.revealDamping,
			parallaxStrength: hero3dParams.parallaxStrength,
			tiltStrength: hero3dParams.tiltStrength,
			liftStrength: hero3dParams.liftStrength,
			rippleStrength: hero3dParams.rippleStrength,
			rippleFrequency: hero3dParams.rippleFrequency,
			rippleSpeed: hero3dParams.rippleSpeed,
			rippleDecay: hero3dParams.rippleDecay,
			bounceStrength: hero3dParams.bounceStrength,
			bounceFrequency: hero3dParams.bounceFrequency,
			bounceDecay: hero3dParams.bounceDecay,
			fadeStrength: hero3dParams.fadeStrength,
			fadeSoftness: hero3dParams.fadeSoftness,
			glowStrength: hero3dParams.glowStrength,
			glowRadius: hero3dParams.glowRadius,
			chromaStrength: hero3dParams.chromaStrength,
			grainStrength: hero3dParams.grainStrength,
			grainScale: hero3dParams.grainScale,
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
