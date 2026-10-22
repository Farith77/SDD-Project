import type { GeocodingApiResponse } from '../types/index.js';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const TIMEOUT_MS = 10000;

export class GeocodingClient {
  async fetchGeocoding(cityName: string): Promise<GeocodingApiResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const params = new URLSearchParams({
        name: cityName,
        count: '1',
        language: 'en',
      });

      const url = GEOCODING_API_URL + '?' + params.toString();
      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }

      const data: GeocodingApiResponse = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}
