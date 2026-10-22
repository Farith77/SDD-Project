import type { ForecastApiResponse } from '../types/index.js';

const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';
const TIMEOUT_MS = 10000;

export class ForecastClient {
  async fetchForecast(latitude: number, longitude: number): Promise<ForecastApiResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: 'temperature_2m,relative_humidity_2m,precipitation',
        timezone: 'auto',
      });

      const url = FORECAST_API_URL + '?' + params.toString();
      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }

      const data: ForecastApiResponse = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}
