import React from 'react';
import type { WeatherData } from '../types/weather';
import clearDayIcon from '@bybas/weather-icons/production/fill/all/clear-day.svg';
import clearNightIcon from '@bybas/weather-icons/production/fill/all/clear-night.svg';
import overcastIcon from '@bybas/weather-icons/production/fill/all/overcast.svg';
import overcastDayIcon from '@bybas/weather-icons/production/fill/all/overcast-day.svg';
import overcastNightIcon from '@bybas/weather-icons/production/fill/all/overcast-night.svg';
import drizzleIcon from '@bybas/weather-icons/production/fill/all/drizzle.svg';
import fogIcon from '@bybas/weather-icons/production/fill/all/fog.svg';
import hailIcon from '@bybas/weather-icons/production/fill/all/hail.svg';
import lightningIcon from '@bybas/weather-icons/production/fill/all/lightning-bolt.svg';
import windIcon from '@bybas/weather-icons/production/fill/all/wind.svg';
import humidityIcon from '@bybas/weather-icons/production/fill/all/humidity.svg';
import barometerIcon from '@bybas/weather-icons/production/fill/all/barometer.svg';

interface WeatherCardProps {
  weather: WeatherData;
  isRefreshing?: boolean;
  cardClassName: string;
  accentClassName: string;
  textClassName: string;
}

function resolveIcon(weather: WeatherData): string {
  if (!weather.isDay) {
    if (weather.conditions === 'overcast') {
      return overcastNightIcon;
    }
    return clearNightIcon;
  }

  switch (weather.conditions) {
    case 'sunny':
    case 'partly_cloudy':
      return clearDayIcon;
    case 'overcast':
      return overcastDayIcon;
    case 'rain':
      return drizzleIcon;
    case 'storm':
      return lightningIcon;
    case 'snow':
      return hailIcon;
    case 'fog':
      return fogIcon;
    default:
      return overcastIcon;
  }
}

function formatWindDirection(deg: number | undefined): string | null {
  if (deg == null || Number.isNaN(deg)) return null;
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((deg % 360) / 45)) % 8;
  return directions[index];
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  isRefreshing,
  cardClassName,
  accentClassName,
  textClassName,
}) => {
  const updatedAtLabel = new Date(weather.timestamp).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  const feelsLike = weather.feelsLikeF != null ? Math.round(weather.feelsLikeF) : null;
  const windDirection = formatWindDirection(weather.windDirectionDeg);
  const windSpeed = weather.windSpeedMph != null ? Math.round(weather.windSpeedMph) : null;
  const humidity = weather.humidityPercent != null ? Math.round(weather.humidityPercent) : null;
  const precipitation =
    weather.precipitationIn != null && weather.precipitationIn > 0
      ? Number(weather.precipitationIn.toFixed(2))
      : null;
  const uvIndex = weather.uvIndex != null ? Math.round(weather.uvIndex) : null;

  return (
    <section
      aria-label="Current weather"
      className={`rounded-2xl p-6 shadow-xl transition-colors duration-500 animate-fadeInUp ${cardClassName} ${textClassName}`}
    >
      <div className="grid grid-cols-[minmax(0,1.4fr)_auto] gap-4 items-start">
        {/* Left column: all text content (nested header + rows) */}
        <div className="flex flex-col gap-3 min-w-0">
          <header>
            <h1 className="text-lg font-semibold tracking-tight break-words">{weather.locationName}</h1>
            <p className="mt-1 text-xs opacity-80">
              Updated {updatedAtLabel}
              {isRefreshing ? ' · Refreshing…' : null}
            </p>
          </header>
  
          <div>
            <div className="mb-2 flex items-baseline gap-3">
              <p className="text-5xl font-semibold leading-none">{Math.round(weather.temperatureF)}</p>
              <span className="text-xl opacity-80">°F</span>
            </div>
            <p className="text-sm">{weather.description}</p>

            {(feelsLike != null || windSpeed != null || humidity != null || precipitation != null || uvIndex != null) && (
              <dl className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs opacity-90">
                {feelsLike != null && (
                  <div className="flex items-center gap-1">
                    <img src={barometerIcon} alt="" aria-hidden="true" className="h-10 w-10" />
                    <dt className="sr-only">Feels like</dt>
                    <dd>Feels like {feelsLike}°F</dd>
                  </div>
                )}
                {windSpeed != null && (
                  <div className="flex items-center gap-1">
                    <img src={windIcon} alt="" aria-hidden="true" className="h-10 w-10" />
                    <dt className="sr-only">Wind</dt>
                    <dd>
                      Wind {windSpeed} mph
                      {windDirection ? ` ${windDirection}` : ''}
                    </dd>
                  </div>
                )}
                {humidity != null && (
                  <div className="flex items-center gap-1">
                    <img src={humidityIcon} alt="" aria-hidden="true" className="h-10 w-10" />
                    <dt className="sr-only">Humidity</dt>
                    <dd>Humidity {humidity}%</dd>
                  </div>
                )}
                {precipitation != null && (
                  <div className="flex items-center gap-1">
                    <dt className="sr-only">Precipitation</dt>
                    <dd>Precip {precipitation} in</dd>
                  </div>
                )}
                {uvIndex != null && (
                  <div className="flex items-center gap-1">
                    <dt className="sr-only">UV index</dt>
                    <dd>UV {uvIndex}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>
  
        {/* Right column: icon, top-aligned and independent of header height */}
        <div className={`flex items-start justify-center rounded-full p-4 ${accentClassName}`}>
          <img src={resolveIcon(weather)} alt={weather.description} className="h-28 w-28" />
        </div>
      </div>
    </section>
  );
};

