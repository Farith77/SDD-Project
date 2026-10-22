// Geocoding Service Types
export interface Coordinates {
  latitude: number;
  longitude: number;
  cityName: string;
}

export type GeocodingErrorType =
  | 'CITY_NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'SERVICE_ERROR'
  | 'INVALID_RESPONSE';

export interface GeocodingError {
  type: GeocodingErrorType;
  statusCode?: number;
}

export type GeocodingResult =
  | { success: true; data: Coordinates }
  | { success: false; error: GeocodingError };

// Forecast Service Types
export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
}

export type ForecastErrorType =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'SERVICE_ERROR'
  | 'INCOMPLETE_DATA'
  | 'INVALID_RESPONSE';

export interface ForecastError {
  type: ForecastErrorType;
  statusCode?: number;
}

export type ForecastResult =
  | { success: true; data: WeatherData }
  | { success: false; error: ForecastError };

// App State
export type AppState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; cityName: string; weather: WeatherData }
  | { status: 'error'; message: string };

// API Response Types
export interface GeocodingApiResponse {
  results?: Array<{
    latitude?: number;
    longitude?: number;
    name?: string;
    [key: string]: unknown;
  }>;
}

export interface ForecastApiResponse {
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    precipitation?: number;
  };
  [key: string]: unknown;
}
