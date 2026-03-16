import { fetchWithTimeout } from '../utils/fetchWithTimeout';

export interface ZipLocation {
  latitude: number;
  longitude: number;
  locationName: string;
  zip: string;
  country: string;
}

interface ZippopotamPlace {
  'place name': string;
  longitude: string;
  latitude: string;
  state: string;
}

interface ZippopotamResponse {
  country: string;
  'post code': string;
  places: ZippopotamPlace[];
}

export async function lookupZip(zip: string, countryCode: string = 'us'): Promise<ZipLocation> {
  const trimmedZip = zip.trim();

  if (!/^\d{5}$/.test(trimmedZip)) {
    throw new Error('Please enter a valid 5-digit ZIP code.');
  }

  const url = `https://api.zippopotam.us/${encodeURIComponent(countryCode.toLowerCase())}/${encodeURIComponent(trimmedZip)}`;
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('We could not find that location. Please check the ZIP code and try again.');
    }
    throw new Error(`Location lookup failed (${response.status}).`);
  }

  const data = (await response.json()) as Partial<ZippopotamResponse>;

  if (!data.places || data.places.length === 0) {
    throw new Error('Location lookup returned an unexpected response. Please try a different ZIP code.');
  }

  const primary = data.places[0];

  const latitude = Number(primary.latitude);
  const longitude = Number(primary.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Location lookup returned invalid coordinates.');
  }

  const locationName = `${primary['place name']}, ${primary.state}`;

  return {
    latitude,
    longitude,
    locationName,
    zip: data['post code'] ?? trimmedZip,
    country: data.country ?? countryCode.toUpperCase(),
  };
}

