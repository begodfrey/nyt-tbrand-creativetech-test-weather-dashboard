import type { NormalizedConditions, WeatherData } from '../types/weather';
import { getWeatherMood } from '../utils/getWeatherMood';
import { fetchWithTimeout } from '../utils/fetchWithTimeout';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

interface OpenMeteoCurrent {
  temperature_2m: number;
  weather_code: number;
  is_day: number;
  time: string;
  apparent_temperature?: number;
  wind_speed_10m?: number;
  wind_direction_10m?: number;
  relative_humidity_2m?: number;
  precipitation?: number;
  uv_index?: number;
}

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: OpenMeteoCurrent;
}

function mapWeatherCodeToConditions(code: number): { description: string; conditions: NormalizedConditions } {
  if (code === 0) {
    return { description: 'Clear sky', conditions: 'sunny' };
  }

  if (code === 1 || code === 2) {
    return { description: 'Partly cloudy', conditions: 'partly_cloudy' };
  }

  if (code === 3) {
    return { description: 'Overcast', conditions: 'overcast' };
  }

  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return { description: 'Rain', conditions: 'rain' };
  }

  if ((code >= 95 && code <= 99)) {
    return { description: 'Thunderstorm', conditions: 'storm' };
  }

  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return { description: 'Snow', conditions: 'snow' };
  }

  if (code === 45 || code === 48) {
    return { description: 'Foggy', conditions: 'fog' };
  }

  return { description: 'Unknown conditions', conditions: 'unknown' };
}

export async function fetchCurrentWeather(params: {
  latitude: number;
  longitude: number;
  locationName: string;
}): Promise<WeatherData> {
  const url = new URL(OPEN_METEO_BASE_URL);
  url.searchParams.set('latitude', String(params.latitude));
  url.searchParams.set('longitude', String(params.longitude));
  url.searchParams.set(
    'current',
    'temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m,wind_direction_10m,relative_humidity_2m,precipitation,uv_index',
  );
  url.searchParams.set('temperature_unit', 'fahrenheit');
  url.searchParams.set('wind_speed_unit', 'mph');
  url.searchParams.set('precipitation_unit', 'inch');
  url.searchParams.set('timezone', 'auto');

  const response = await fetchWithTimeout(url.toString());

  if (!response.ok) {
    throw new Error(`Weather API error (${response.status})`);
  }

  const data = (await response.json()) as Partial<OpenMeteoResponse>;

  if (!data.current || typeof data.current.temperature_2m !== 'number' || typeof data.current.weather_code !== 'number') {
    throw new Error('Weather API returned an unexpected response shape.');
  }

  const current = data.current;
  const { description, conditions } = mapWeatherCodeToConditions(current.weather_code);
  const isDay = current.is_day === 1;

  const mood = getWeatherMood({
    weatherCode: current.weather_code,
    isDay,
    temperatureC: current.temperature_2m,
  });

  const timestamp = current.time ?? new Date().toISOString();

  return {
    locationName: params.locationName,
    latitude: data.latitude ?? params.latitude,
    longitude: data.longitude ?? params.longitude,
    temperatureF: current.temperature_2m,
    feelsLikeF: current.apparent_temperature,
    description,
    iconCode: current.weather_code,
    isDay,
    conditions,
    mood,
    timestamp,
    windSpeedMph: current.wind_speed_10m,
    windDirectionDeg: current.wind_direction_10m,
    humidityPercent: current.relative_humidity_2m,
    precipitationIn: current.precipitation,
    uvIndex: current.uv_index,
  };
}

