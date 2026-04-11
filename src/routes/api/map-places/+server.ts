import { dev } from '$app/environment';
import { json } from '@sveltejs/kit';
import type { MapPlace, MapPlaceStatus } from '$generated/prisma/client';
import { mapRegionById } from '$lib/data/mapRegions';
import { prisma } from '$lib/server/prisma';
import type { MapPlaceRecord, MapPlaceSubmissionPayload } from '$lib/types/mapPlaces';

export const prerender = false;

const MAX_NAME_LENGTH = 48;

function serializeMapPlace(place: MapPlace): MapPlaceRecord {
	return {
		id: place.id,
		name: place.name,
		regionId: place.regionId,
		regionCode: place.regionCode,
		regionName: place.regionName,
		countryCode: place.countryCode as MapPlaceRecord['countryCode'],
		countryName: place.countryName,
		latitude: place.latitude,
		longitude: place.longitude,
		status: place.status as MapPlaceStatus,
		createdAt: place.createdAt.toISOString(),
		updatedAt: place.updatedAt.toISOString()
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function normalizeSubmittedName(value: unknown) {
	if (typeof value !== 'string') return null;

	const normalized = value.trim().replace(/\s+/g, ' ');
	if (!normalized || normalized.length > MAX_NAME_LENGTH) {
		return null;
	}

	return normalized;
}

function parseSubmission(value: unknown): { name: string; regionId: string } | null {
	if (!isRecord(value)) return null;

	const name = normalizeSubmittedName(value.name);
	const regionId = typeof value.regionId === 'string' ? value.regionId.trim() : '';

	if (!name || !mapRegionById.has(regionId)) {
		return null;
	}

	return { name, regionId };
}

export const GET = async ({ url }) => {
	try {
		const includeAll = dev && url.searchParams.get('includeAll') === 'true';
		const places = await prisma.mapPlace.findMany({
			where: includeAll ? undefined : { status: 'visible' },
			orderBy: { createdAt: 'desc' }
		});

		return json({ places: places.map(serializeMapPlace) });
	} catch (error) {
		console.error('[map-places] GET error:', error);
		return json(
			{ error: 'Failed to fetch map places', details: String(error) },
			{ status: 500 }
		);
	}
};

export const POST = async ({ request }) => {
	try {
		const body = (await request.json()) as Partial<MapPlaceSubmissionPayload>;
		const submission = parseSubmission(body);

		if (!submission) {
			return json(
				{
					error:
						'Invalid payload: expected a non-empty name up to 48 characters and a valid regionId.'
				},
				{ status: 400 }
			);
		}

		const region = mapRegionById.get(submission.regionId);
		if (!region) {
			return json({ error: 'Unknown regionId.' }, { status: 400 });
		}

		const place = await prisma.mapPlace.create({
			data: {
				name: submission.name,
				regionId: region.id,
				regionCode: region.regionCode,
				regionName: region.regionName,
				countryCode: region.countryCode,
				countryName: region.countryName,
				latitude: region.centroid.lat,
				longitude: region.centroid.lng,
				status: 'visible'
			}
		});

		return json({ place: serializeMapPlace(place) }, { status: 201 });
	} catch (error) {
		console.error('[map-places] POST error:', error);
		return json(
			{ error: 'Failed to save map place', details: String(error) },
			{ status: 500 }
		);
	}
};
