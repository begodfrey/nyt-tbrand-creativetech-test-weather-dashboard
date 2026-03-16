import { useCallback, useEffect, useState } from 'react';
import type { AppError, WeatherData } from '../types/weather';
import { fetchCurrentWeather } from '../api/openMeteo';

interface UseGeolocationWeatherOptions {
  enabled?: boolean;
}

interface UseGeolocationWeatherState {
  weather: WeatherData | null;
  isLoading: boolean;
  error: AppError | null;
}

export interface UseGeolocationWeather extends UseGeolocationWeatherState {
  refresh: () => void;
}

export function useGeolocationWeather(options: UseGeolocationWeatherOptions = {}): UseGeolocationWeather {
  const { enabled = true } = options;

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const requestWeather = useCallback(() => {
    if (!enabled) return;

    if (!('geolocation' in navigator)) {
      setError({
        source: 'location',
        message: 'Your browser does not support geolocation.',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const locationName = 'Your location';
          const data = await fetchCurrentWeather({ latitude, longitude, locationName });
          setWeather(data);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Something went wrong while fetching weather data.';
          setError({
            source: 'weather',
            message,
          });
        } finally {
          setIsLoading(false);
        }
      },
      (geoError) => {
        let message = 'We could not access your location.';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          message =
            'Location permission was denied. Please search by ZIP code below to see the weather in a specific area.';
        }
        setError({
          source: 'location',
          message,
          detail: geoError.message,
        });
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10_000,
        maximumAge: 60_000,
      },
    );
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    requestWeather();
  }, [enabled, requestWeather]);

  const refresh = useCallback(() => {
    requestWeather();
  }, [requestWeather]);

  return {
    weather,
    isLoading,
    error,
    refresh,
  };
}

