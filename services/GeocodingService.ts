import { GeocodingClient } from '../clients/GeocodingClient.js';
import type { Coordinates, GeocodingResult, GeocodingError } from '../types/index.js';

export class GeocodingService {
  private client: GeocodingClient;

  constructor() {
    this.client = new GeocodingClient();
  }

  async geocode(cityName: string): Promise<GeocodingResult> {
    try {
      const response = await this.client.fetchGeocoding(cityName);

      if (!response.results || response.results.length === 0) {
        return {
          success: false,
          error: { type: 'CITY_NOT_FOUND' },
        };
      }

      const firstResult = response.results[0];

      if (
        firstResult.latitude === undefined ||
        firstResult.latitude === null ||
        firstResult.longitude === undefined ||
        firstResult.longitude === null ||
        typeof firstResult.latitude !== 'number' ||
        typeof firstResult.longitude !== 'number'
      ) {
        return {
          success: false,
          error: { type: 'CITY_NOT_FOUND' },
        };
      }

      const coordinates: Coordinates = {
        latitude: firstResult.latitude,
        longitude: firstResult.longitude,
        cityName: firstResult.name || 'Unknown',
      };

      return {
        success: true,
        data: coordinates,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): GeocodingResult {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: { type: 'TIMEOUT' },
        };
      }

      const message = error.message;
      if (message.includes('HTTP')) {
        const statusCodeMatch = message.match(/HTTP (\d+)/);
        if (statusCodeMatch) {
          const statusCode = parseInt(statusCodeMatch[1], 10);
          return {
            success: false,
            error: { type: 'SERVICE_ERROR', statusCode },
          };
        }
      }

      if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
        return {
          success: false,
          error: { type: 'NETWORK_ERROR' },
        };
      }
    }

    return {
      success: false,
      error: { type: 'INVALID_RESPONSE' },
    };
  }
}
