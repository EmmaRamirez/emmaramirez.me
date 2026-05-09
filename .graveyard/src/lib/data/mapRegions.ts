export type MapRegionKind = 'state' | 'province';

export interface MapRegionRecord {
	id: string;
	countryCode: 'US' | 'CA';
	countryName: string;
	regionCode: string;
	regionName: string;
	kind: MapRegionKind;
	centroid: {
		lng: number;
		lat: number;
	};
}

export const mapRegions = [
	{
		id: 'CA-AB',
		countryCode: 'CA',
		countryName: 'Canada',
		regionCode: 'AB',
		regionName: 'Alberta',
		kind: 'province',
		centroid: { lng: -115.000653, lat: 54.497641 }
	},
	{
		id: 'CA-BC',
		countryCode: 'CA',
		countryName: 'Canada',
		regionCode: 'BC',
		regionName: 'British Columbia',
		kind: 'province',
		centroid: { lng: -126.48695, lat: 54.152485 }
	},
	{
		id: 'CA-MB',
		countryCode: 'CA',
		countryName: 'Canada',
		regionCode: 'MB',
		regionName: 'Manitoba',
		kind: 'province',
		centroid: { lng: -95.590671, lat: 54.49996 }
	},
	{
		id: 'CA-NB',
		countryCode: 'CA',
		countryName: 'Canada',
		regionCode: 'NB',
		regionName: 'New Brunswick',
		kind: 'province',
		centroid: { lng: -66.408051, lat: 46.56444 }
	},
	{
		id: 'CA-NL',
		countryCode: 'CA',
		countryName: 'Canada',
		regionCode: 'NL',
		regionName: 'Newfoundland and Labrador',
		kind: 'province',
		centroid: { lng: -60.201116, lat: 53.548744 }
	},
	{
		id: 'CA-NS',
		countryCode: 'CA',
		countryName: 'Canada',
		regionCode: 'NS',
		regionName: 'Nova Scotia',
		kind: 'province',
		centroid: { lng: -63.355002, lat: 45.248884 }
	},
	{
		id: 'CA-NT',
		countryCode: 'CA',
		countryName: 'Canada',
		regionCode: 'NT',
		regionName: 'Northwest Territories',
		kind: 'province',
		centroid: { lng: -119.215053, lat: 69.371481 }
	},
	{
		id: 'CA-NU',
		countryCode: 'CA',
		countryName: 'Canada',
		regionCode: 'NU',
		regionName: 'Nunavut',
		kind: 'province',
		centroid: { lng: -90.871925, lat: 67.511381 }
	},
	{
		id: 'CA-ON',
		countryCode: 'CA',
		countryName: 'Canada',
		regionCode: 'ON',
		regionName: 'Ontario',
		kind: 'province',
		centroid: { lng: -84.739524, lat: 49.391134 }
	},
	{
		id: 'CA-PE',
		countryCode: 'CA',
		countryName: 'Canada',
		regionCode: 'PE',
		regionName: 'Prince Edward Island',
		kind: 'province',
		centroid: { lng: -63.193604, lat: 46.504995 }
	},
	{
		id: 'CA-QC',
		countryCode: 'CA',
		countryName: 'Canada',
		regionCode: 'QC',
		regionName: 'Quebec',
		kind: 'province',
		centroid: { lng: -68.605422, lat: 53.791365 }
	},
	{
		id: 'CA-SK',
		countryCode: 'CA',
		countryName: 'Canada',
		regionCode: 'SK',
		regionName: 'Saskatchewan',
		kind: 'province',
		centroid: { lng: -105.684303, lat: 54.5 }
	},
	{
		id: 'CA-YT',
		countryCode: 'CA',
		countryName: 'Canada',
		regionCode: 'YT',
		regionName: 'Yukon',
		kind: 'province',
		centroid: { lng: -132.409954, lat: 64.821241 }
	},
	{
		id: 'US-AK',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'AK',
		regionName: 'Alaska',
		kind: 'state',
		centroid: { lng: -159.445616, lat: 61.482187 }
	},
	{
		id: 'US-AL',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'AL',
		regionName: 'Alabama',
		kind: 'state',
		centroid: { lng: -86.680155, lat: 32.624187 }
	},
	{
		id: 'US-AR',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'AR',
		regionName: 'Arkansas',
		kind: 'state',
		centroid: { lng: -92.173527, lat: 34.751978 }
	},
	{
		id: 'US-AZ',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'AZ',
		regionName: 'Arizona',
		kind: 'state',
		centroid: { lng: -111.92885, lat: 34.168684 }
	},
	{
		id: 'US-CA',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'CA',
		regionName: 'California',
		kind: 'state',
		centroid: { lng: -119.273428, lat: 37.274109 }
	},
	{
		id: 'US-CO',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'CO',
		regionName: 'Colorado',
		kind: 'state',
		centroid: { lng: -105.550954, lat: 38.999346 }
	},
	{
		id: 'US-CT',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'CT',
		regionName: 'Connecticut',
		kind: 'state',
		centroid: { lng: -72.76325, lat: 41.518738 }
	},
	{
		id: 'US-DC',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'DC',
		regionName: 'District of Columbia',
		kind: 'state',
		centroid: { lng: -77.013356, lat: 38.892545 }
	},
	{
		id: 'US-DE',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'DE',
		regionName: 'Delaware',
		kind: 'state',
		centroid: { lng: -75.416827, lat: 39.141746 }
	},
	{
		id: 'US-FL',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'FL',
		regionName: 'Florida',
		kind: 'state',
		centroid: { lng: -83.832146, lat: 28.061896 }
	},
	{
		id: 'US-GA',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'GA',
		regionName: 'Georgia',
		kind: 'state',
		centroid: { lng: -83.246114, lat: 32.678957 }
	},
	{
		id: 'US-HI',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'HI',
		regionName: 'Hawaii',
		kind: 'state',
		centroid: { lng: -157.286133, lat: 20.588611 }
	},
	{
		id: 'US-IA',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'IA',
		regionName: 'Iowa',
		kind: 'state',
		centroid: { lng: -93.386669, lat: 41.940463 }
	},
	{
		id: 'US-ID',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'ID',
		regionName: 'Idaho',
		kind: 'state',
		centroid: { lng: -114.144273, lat: 45.497736 }
	},
	{
		id: 'US-IL',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'IL',
		regionName: 'Illinois',
		kind: 'state',
		centroid: { lng: -89.50078, lat: 39.746949 }
	},
	{
		id: 'US-IN',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'IN',
		regionName: 'Indiana',
		kind: 'state',
		centroid: { lng: -86.430955, lat: 39.774333 }
	},
	{
		id: 'US-KS',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'KS',
		regionName: 'Kansas',
		kind: 'state',
		centroid: { lng: -98.332346, lat: 38.498206 }
	},
	{
		id: 'US-KY',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'KY',
		regionName: 'Kentucky',
		kind: 'state',
		centroid: { lng: -85.694307, lat: 37.799896 }
	},
	{
		id: 'US-LA',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'LA',
		regionName: 'Louisiana',
		kind: 'state',
		centroid: { lng: -91.521771, lat: 31.013967 }
	},
	{
		id: 'US-MA',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'MA',
		regionName: 'Massachusetts',
		kind: 'state',
		centroid: { lng: -71.722632, lat: 42.192403 }
	},
	{
		id: 'US-MD',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'MD',
		regionName: 'Maryland',
		kind: 'state',
		centroid: { lng: -77.268034, lat: 38.815869 }
	},
	{
		id: 'US-ME',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'ME',
		regionName: 'Maine',
		kind: 'state',
		centroid: { lng: -69.030715, lat: 45.259489 }
	},
	{
		id: 'US-MI',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'MI',
		regionName: 'Michigan',
		kind: 'state',
		centroid: { lng: -86.414524, lat: 44.933611 }
	},
	{
		id: 'US-MN',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'MN',
		regionName: 'Minnesota',
		kind: 'state',
		centroid: { lng: -93.422269, lat: 46.442508 }
	},
	{
		id: 'US-MO',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'MO',
		regionName: 'Missouri',
		kind: 'state',
		centroid: { lng: -92.450113, lat: 38.306513 }
	},
	{
		id: 'US-MS',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'MS',
		regionName: 'Mississippi',
		kind: 'state',
		centroid: { lng: -89.867735, lat: 32.588588 }
	},
	{
		id: 'US-MT',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'MT',
		regionName: 'Montana',
		kind: 'state',
		centroid: { lng: -110.044783, lat: 46.697186 }
	},
	{
		id: 'US-NC',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'NC',
		regionName: 'North Carolina',
		kind: 'state',
		centroid: { lng: -80.017458, lat: 35.217518 }
	},
	{
		id: 'US-ND',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'ND',
		regionName: 'North Dakota',
		kind: 'state',
		centroid: { lng: -100.304045, lat: 47.466696 }
	},
	{
		id: 'US-NE',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'NE',
		regionName: 'Nebraska',
		kind: 'state',
		centroid: { lng: -99.679674, lat: 41.502308 }
	},
	{
		id: 'US-NH',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'NH',
		regionName: 'New Hampshire',
		kind: 'state',
		centroid: { lng: -71.624047, lat: 43.999792 }
	},
	{
		id: 'US-NJ',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'NJ',
		regionName: 'New Jersey',
		kind: 'state',
		centroid: { lng: -74.732211, lat: 40.176888 }
	},
	{
		id: 'US-NM',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'NM',
		regionName: 'New Mexico',
		kind: 'state',
		centroid: { lng: -106.024709, lat: 34.165946 }
	},
	{
		id: 'US-NV',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'NV',
		regionName: 'Nevada',
		kind: 'state',
		centroid: { lng: -117.022406, lat: 38.500945 }
	},
	{
		id: 'US-NY',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'NY',
		regionName: 'New York',
		kind: 'state',
		centroid: { lng: -75.931661, lat: 42.781173 }
	},
	{
		id: 'US-OH',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'OH',
		regionName: 'Ohio',
		kind: 'state',
		centroid: { lng: -82.668297, lat: 40.201535 }
	},
	{
		id: 'US-OK',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'OK',
		regionName: 'Oklahoma',
		kind: 'state',
		centroid: { lng: -98.715732, lat: 35.318842 }
	},
	{
		id: 'US-OR',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'OR',
		regionName: 'Oregon',
		kind: 'state',
		centroid: { lng: -120.508478, lat: 44.125762 }
	},
	{
		id: 'US-PA',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'PA',
		regionName: 'Pennsylvania',
		kind: 'state',
		centroid: { lng: -77.607604, lat: 40.99569 }
	},
	{
		id: 'US-RI',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'RI',
		regionName: 'Rhode Island',
		kind: 'state',
		centroid: { lng: -71.489862, lat: 41.669354 }
	},
	{
		id: 'US-SC',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'SC',
		regionName: 'South Carolina',
		kind: 'state',
		centroid: { lng: -80.940322, lat: 33.615513 }
	},
	{
		id: 'US-SD',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'SD',
		regionName: 'South Dakota',
		kind: 'state',
		centroid: { lng: -100.246537, lat: 44.216132 }
	},
	{
		id: 'US-TN',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'TN',
		regionName: 'Tennessee',
		kind: 'state',
		centroid: { lng: -85.995538, lat: 35.830936 }
	},
	{
		id: 'US-TX',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'TX',
		regionName: 'Texas',
		kind: 'state',
		centroid: { lng: -100.084967, lat: 31.194706 }
	},
	{
		id: 'US-UT',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'UT',
		regionName: 'Utah',
		kind: 'state',
		centroid: { lng: -111.545465, lat: 39.500486 }
	},
	{
		id: 'US-VA',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'VA',
		regionName: 'Virginia',
		kind: 'state',
		centroid: { lng: -79.45881, lat: 38.002543 }
	},
	{
		id: 'US-VT',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'VT',
		regionName: 'Vermont',
		kind: 'state',
		centroid: { lng: -72.464757, lat: 43.871085 }
	},
	{
		id: 'US-WA',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'WA',
		regionName: 'Washington',
		kind: 'state',
		centroid: { lng: -120.812449, lat: 47.275003 }
	},
	{
		id: 'US-WI',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'WI',
		regionName: 'Wisconsin',
		kind: 'state',
		centroid: { lng: -89.958105, lat: 44.725487 }
	},
	{
		id: 'US-WV',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'WV',
		regionName: 'West Virginia',
		kind: 'state',
		centroid: { lng: -80.170812, lat: 38.919931 }
	},
	{
		id: 'US-WY',
		countryCode: 'US',
		countryName: 'United States',
		regionCode: 'WY',
		regionName: 'Wyoming',
		kind: 'state',
		centroid: { lng: -107.552775, lat: 43.000251 }
	}
] satisfies MapRegionRecord[];

export const mapRegionById = new Map(mapRegions.map((region) => [region.id, region]));

export function isMapRegionId(value: string): value is MapRegionRecord['id'] {
	return mapRegionById.has(value);
}
