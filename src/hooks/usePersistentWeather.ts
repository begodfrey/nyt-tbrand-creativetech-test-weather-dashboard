import { useEffect, useState } from 'react';
import type { LocationSource, WeatherData } from '../types/weather';

const STORAGE_KEY = 'weather-dashboard-state';

export interface PersistentWeatherMeta {
  source: LocationSource;
  zip?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  country?: string;
}

export interface PersistentWeatherState {
  data: WeatherData | null;
  meta: PersistentWeatherMeta | null;
  savedAt: string | null;
}

export interface UsePersistentWeather {
  weatherData: PersistentWeatherState;
  saveWeatherData: (data: WeatherData, meta: PersistentWeatherMeta) => void;
  clearWeatherData: () => void;
}

export function usePersistentWeather(): UsePersistentWeather {
  const [weatherData, setWeatherData] = useState<PersistentWeatherState>({
    data: null,
    meta: null,
    savedAt: null,
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PersistentWeatherState;
      if (!parsed || typeof parsed !== 'object') return;
      setWeatherData({
        data: parsed.data ?? null,
        meta: parsed.meta ?? null,
        savedAt: parsed.savedAt ?? null,
      });
    } catch {
      // If storage is unavailable or corrupted, we silently ignore and start fresh.
    }
  }, []);

  const saveWeatherData = (data: WeatherData, meta: PersistentWeatherMeta) => {
    const next: PersistentWeatherState = {
      data,
      meta,
      savedAt: new Date().toISOString(),
    };

    setWeatherData(next);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage write errors; UI already reflects the new state in memory.
    }
  };

  const clearWeatherData = () => {
    setWeatherData({
      data: null,
      meta: null,
      savedAt: null,
    });

    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
  };

  return { weatherData, saveWeatherData, clearWeatherData };
}

