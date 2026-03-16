import type { WeatherMood } from '../types/weather';

export interface WeatherMoodInput {
  weatherCode: number;
  isDay: boolean;
  temperatureC: number;
}

export function getWeatherMood(input: WeatherMoodInput): WeatherMood {
  const { weatherCode, isDay } = input;

  if (!isDay) {
    return 'night';
  }

  if (weatherCode >= 95 && weatherCode <= 99) {
    return 'stormy';
  }

  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
    return 'overcast';
  }

  if (weatherCode === 3 || weatherCode === 45 || weatherCode === 48) {
    return 'overcast';
  }

  if (weatherCode === 0 || weatherCode === 1 || weatherCode === 2) {
    return 'bright';
  }

  return 'neutral';
}

