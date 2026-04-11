import { dev } from '$app/environment';
import { json } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { Prisma, type MapPlace, type MapPlaceStatus } from '$generated/prisma/client';
import { mapRegionById } from '$lib/data/mapRegions';
import { prisma } from '$lib/server/prisma';
import type { MapPlaceRecord, MapPlaceSubmissionPayload } from '$lib/types/mapPlaces';

export const prerender = false;

const MAX_NAME_LENGTH = 48;
type MapPlaceDelegate = typeof prisma extends { mapPlace: infer Delegate } ? Delegate : never;

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

function parseMapPlaceId(value: unknown) {
	if (!isRecord(value)) return null;

	const id = typeof value.id === 'string' ? value.id.trim() : '';
	return id.length > 0 ? id : null;
}

function getMapPlaceDelegate() {
	return (prisma as typeof prisma & { mapPlace?: MapPlaceDelegate }).mapPlace;
}

async function listMapPlaces(includeAll: boolean) {
	const delegate = getMapPlaceDelegate();
	if (delegate) {
		return delegate.findMany({
			where: includeAll ? undefined : { status: 'visible' },
			orderBy: { createdAt: 'desc' }
		});
	}

	const whereClause = includeAll
		? Prisma.empty
		: Prisma.sql`WHERE "status" = 'visible'::"MapPlaceStatus"`;

	return prisma.$queryRaw<MapPlace[]>(Prisma.sql`
		SELECT *
		FROM "MapPlace"
		${whereClause}
		ORDER BY "createdAt" DESC
	`);
}

async function createMapPlace(submission: { name: string; regionId: string }) {
	const region = mapRegionById.get(submission.regionId);
	if (!region) {
		throw new Error('Unknown regionId.');
	}

	const delegate = getMapPlaceDelegate();
	if (delegate) {
		return delegate.create({
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
	}

	const [place] = await prisma.$queryRaw<MapPlace[]>(Prisma.sql`
		INSERT INTO "MapPlace" (
			"id",
			"name",
			"regionId",
			"regionCode",
			"regionName",
			"countryCode",
			"countryName",
			"latitude",
			"longitude",
			"status",
			"updatedAt"
		)
		VALUES (
			${randomUUID()},
			${submission.name},
			${region.id},
			${region.regionCode},
			${region.regionName},
			${region.countryCode},
			${region.countryName},
			${region.centroid.lat},
			${region.centroid.lng},
			'visible'::"MapPlaceStatus",
			NOW()
		)
		RETURNING *
	`);

	if (!place) {
		throw new Error('Failed to save map place.');
	}

	return place;
}

async function deleteMapPlace(id: string) {
	const delegate = getMapPlaceDelegate();
	if (delegate) {
		return delegate.delete({
			where: { id }
		});
	}

	const [place] = await prisma.$queryRaw<MapPlace[]>(Prisma.sql`
		DELETE FROM "MapPlace"
		WHERE "id" = ${id}
		RETURNING *
	`);

	return place ?? null;
}

export const GET = async ({ url }) => {
	try {
		const includeAll = dev && url.searchParams.get('includeAll') === 'true';
		const places = await listMapPlaces(includeAll);

		return json({ places: places.map(serializeMapPlace) });
	} catch (error) {
		console.error('[map-places] GET error:', error);
		return json({ error: 'Failed to fetch map places', details: String(error) }, { status: 500 });
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

		const place = await createMapPlace(submission);

		return json({ place: serializeMapPlace(place) }, { status: 201 });
	} catch (error) {
		console.error('[map-places] POST error:', error);
		return json({ error: 'Failed to save map place', details: String(error) }, { status: 500 });
	}
};

export const DELETE = async ({ request }) => {
	if (!dev) {
		return json({ error: 'Not found' }, { status: 404 });
	}

	try {
		const body = await request.json();
		const id = parseMapPlaceId(body);

		if (!id) {
			return json({ error: 'Invalid payload: expected a non-empty id.' }, { status: 400 });
		}

		const deletedPlace = await deleteMapPlace(id);
		if (!deletedPlace) {
			return json({ error: 'Map place not found.' }, { status: 404 });
		}

		return json({ place: serializeMapPlace(deletedPlace) });
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
			return json({ error: 'Map place not found.' }, { status: 404 });
		}

		console.error('[map-places] DELETE error:', error);
		return json({ error: 'Failed to delete map place', details: String(error) }, { status: 500 });
	}
};
