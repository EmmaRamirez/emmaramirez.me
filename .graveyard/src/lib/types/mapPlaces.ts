export const mapPlaceStatuses = ['visible', 'hidden'] as const;

export type MapPlaceStatus = (typeof mapPlaceStatuses)[number];

export interface MapPlaceRecord {
	id: string;
	name: string;
	regionId: string;
	regionCode: string;
	regionName: string;
	countryCode: 'US' | 'CA';
	countryName: string;
	latitude: number;
	longitude: number;
	status: MapPlaceStatus;
	createdAt: string;
	updatedAt: string;
}

export interface MapPlaceSubmissionPayload {
	name: string;
	regionId: string;
}
