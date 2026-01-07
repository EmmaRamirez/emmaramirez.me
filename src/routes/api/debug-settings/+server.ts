import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

const SETTINGS_KEY = 'default';

type Hero3DParamsPayload = {
	depthScale: number;
	revealRadius: number;
	parallaxXY: number;
	parallaxZ: number;
	splatStretch: number;
	splatCompress: number;
	depthBulge: number;
	contourOffset: number;
	blobAmplitude: number;
	noiseAmplitude: number;
	contourInfluence: number;
	edgeSoftness: number;
	saturationBoost: number;
	contrastBoost: number;
};

type DebugSettingsPayload = {
	headerBlendMode: string;
	showSectionsEnabled: boolean;
	hero3dParams: Hero3DParamsPayload;
};

export const GET = async () => {
	try {
		const settings = await prisma.debugSettings.findUnique({
			where: { key: SETTINGS_KEY }
		});

		return json({ settings });
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
			return json({ error: 'Invalid payload: missing hero3dParams or headerBlendMode' }, { status: 400 });
		}

		const payload = {
			headerBlendMode: body.headerBlendMode,
			showSectionsEnabled: Boolean(body.showSectionsEnabled),
			hero3dParams: body.hero3dParams
		};

		const settings = await prisma.debugSettings.upsert({
			where: { key: SETTINGS_KEY },
			update: payload,
			create: {
				key: SETTINGS_KEY,
				...payload
			}
		});

		return json({ settings });
	} catch (error) {
		console.error('[debug-settings] PUT error:', error);
		return json(
			{ error: 'Failed to save debug settings', details: String(error) },
			{ status: 500 }
		);
	}
};
