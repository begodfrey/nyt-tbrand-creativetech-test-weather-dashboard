import React, { useEffect, useMemo, useState } from 'react';
import { ErrorBanner } from './components/ErrorBanner';
import { SearchBar } from './components/SearchBar';
import { SkeletonWeatherCard } from './components/SkeletonWeatherCard';
import { WeatherCard } from './components/WeatherCard';
import { useGeolocationWeather } from './hooks/useGeolocationWeather';
import { usePersistentWeather } from './hooks/usePersistentWeather';
import { lookupZip } from './api/zippopotam';
import type { AppError, WeatherData } from './types/weather';
import { resolveMoodClasses } from './theme/moodClasses';

const App: React.FC = () => {
  const { weatherData: persistentWeatherData, saveWeatherData } = usePersistentWeather();

  const [activeWeather, setActiveWeather] = useState<WeatherData | null>(null);
  const [zipError, setZipError] = useState<AppError | null>(null);
  const [isZipSearching, setIsZipSearching] = useState(false);
  const [isBackgroundRefreshing, setIsBackgroundRefreshing] = useState(false);
  const [hasBackgroundRefreshed, setHasBackgroundRefreshed] = useState(false);
  const [hasZipOverride, setHasZipOverride] = useState(false);

  const shouldUseGeolocation = !persistentWeatherData.data;

  const {
    weather: geoWeather,
    isLoading: isGeoLoading,
    error: geoError,
  } = useGeolocationWeather({ enabled: shouldUseGeolocation });

  useEffect(() => {
    if (persistentWeatherData.data && !activeWeather) {
      setActiveWeather(persistentWeatherData.data);
    }
  }, [persistentWeatherData.data, activeWeather]);

  useEffect(() => {
    if (geoWeather && shouldUseGeolocation) {
      setActiveWeather(geoWeather);
      saveWeatherData(geoWeather, {
        source: 'geolocation',
        coordinates: {
          latitude: geoWeather.latitude,
          longitude: geoWeather.longitude,
        },
      });
    }
  }, [geoWeather, shouldUseGeolocation, saveWeatherData]);

  useEffect(() => {
    const meta = persistentWeatherData.meta;
    const data = persistentWeatherData.data;
    if (!meta || !data || hasBackgroundRefreshed) return;

    setHasBackgroundRefreshed(true);
    setIsBackgroundRefreshing(true);
    const run = async () => {
      try {
        if (meta.zip) {
          const loc = await lookupZip(meta.zip);
          const { fetchCurrentWeather } = await import('./api/openMeteo');
          const refreshed = await fetchCurrentWeather({
            latitude: loc.latitude,
            longitude: loc.longitude,
            locationName: loc.locationName,
          });
          setActiveWeather(refreshed);
          saveWeatherData(refreshed, {
            source: 'zip',
            zip: meta.zip,
            coordinates: {
              latitude: refreshed.latitude,
              longitude: refreshed.longitude,
            },
            country: loc.country,
          });
        } else if (meta.coordinates) {
          const { fetchCurrentWeather } = await import('./api/openMeteo');
          const refreshed = await fetchCurrentWeather({
            latitude: meta.coordinates.latitude,
            longitude: meta.coordinates.longitude,
            locationName: data.locationName,
          });
          setActiveWeather(refreshed);
          saveWeatherData(refreshed, {
            source: meta.source,
            coordinates: {
              latitude: refreshed.latitude,
              longitude: refreshed.longitude,
            },
            country: meta.country,
          });
        }
      } catch {
        // Swallow background refresh errors; UI keeps showing last known good data.
      } finally {
        setIsBackgroundRefreshing(false);
      }
    };

    void run();
  }, [persistentWeatherData.meta, persistentWeatherData.data, saveWeatherData, hasBackgroundRefreshed]);

  const handleZipSearch = async (zip: string) => {
    setIsZipSearching(true);
    setZipError(null);
    setHasZipOverride(true);

    try {
      const location = await lookupZip(zip);
      const { fetchCurrentWeather } = await import('./api/openMeteo');
      const weather = await fetchCurrentWeather({
        latitude: location.latitude,
        longitude: location.longitude,
        locationName: location.locationName,
      });
      setActiveWeather(weather);
      saveWeatherData(weather, {
        source: 'zip',
        zip: location.zip,
        coordinates: {
          latitude: weather.latitude,
          longitude: weather.longitude,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong while searching by ZIP code.';
      setZipError({
        source: 'zip',
        message,
      });
    } finally {
      setIsZipSearching(false);
    }
  };

  const combinedError: AppError | null = useMemo(() => {
    const locationError = hasZipOverride ? null : geoError;
    return zipError ?? locationError ?? null;
  }, [zipError, geoError, hasZipOverride]);

  const moodClasses = resolveMoodClasses(activeWeather?.mood ?? persistentWeatherData.data?.mood ?? null);

  const showSkeleton = !activeWeather && (isGeoLoading || isZipSearching);

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${moodClasses.appBackground} ${moodClasses.text} transition-colors duration-700`}
    >
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-8">
        <header className="mb-4">
          <h1 className="text-xl font-semibold tracking-tight">Weather Mood Dashboard</h1>
          <p className="mt-1 text-xs opacity-80">
            Share your location or search by ZIP to see your weather.
          </p>
        </header>

        <ErrorBanner error={combinedError} />

        <SearchBar
          onSubmit={handleZipSearch}
          isLoading={isZipSearching}
          inputClassName={`${moodClasses.inputBackground} ${moodClasses.text}`}
        />

        <section aria-live="polite">
          {showSkeleton ? (
            <SkeletonWeatherCard />
          ) : activeWeather ? (
            <WeatherCard
              weather={activeWeather}
              isRefreshing={isBackgroundRefreshing}
              cardClassName={moodClasses.cardBackground}
              accentClassName={moodClasses.accent}
              textClassName={moodClasses.text}
            />
          ) : (
            <div className={`rounded-2xl border border-dashed p-6 text-sm shadow-inner ${moodClasses.cardBackground}`}>
              <p className="font-medium">Waiting for weather data&hellip;</p>
              <p className="mt-1 text-xs opacity-80">
                If you denied location access, you can still see the weather by entering a ZIP code above.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;

