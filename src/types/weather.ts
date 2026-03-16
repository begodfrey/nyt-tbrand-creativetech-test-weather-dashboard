export type LocationSource = 'geolocation' | 'zip' | 'saved';

export type NormalizedConditions =
  | 'sunny'
  | 'partly_cloudy'
  | 'overcast'
  | 'rain'
  | 'storm'
  | 'snow'
  | 'fog'
  | 'unknown';

export type WeatherMood = 'bright' | 'overcast' | 'stormy' | 'night' | 'neutral';

export interface WeatherData {
  locationName: string;
  latitude: number;
  longitude: number;
  temperatureF: number;
  feelsLikeF?: number;
  description: string;
  iconCode: number;
  isDay: boolean;
  conditions: NormalizedConditions;
  mood: WeatherMood;
  timestamp: string;
  windSpeedMph?: number;
  windDirectionDeg?: number;
  humidityPercent?: number;
  precipitationIn?: number;
  uvIndex?: number;
}

export type AppErrorSource = 'location' | 'weather' | 'zip' | 'storage';

export interface AppError {
  message: string;
  detail?: string;
  source: AppErrorSource;
}

