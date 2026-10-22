import { ForecastClient } from '../clients/ForecastClient.js';
import type { WeatherData, ForecastResult, ForecastError } from '../types/index.js';

export class ForecastService {
  private client: ForecastClient;

  constructor() {
    this.client = new ForecastClient();
  }

  async getForecast(latitude: number, longitude: number): Promise<ForecastResult> {
    try {
      const response = await this.client.fetchForecast(latitude, longitude);

      if (!response.current) {
        return {
          success: false,
          error: { type: 'INCOMPLETE_DATA' },
        };
      }

      const current = response.current;

      if (
        current.temperature_2m === undefined ||
        current.temperature_2m === null ||
        current.relative_humidity_2m === undefined ||
        current.relative_humidity_2m === null ||
        current.precipitation === undefined ||
        current.precipitation === null ||
        typeof current.temperature_2m !== 'number' ||
        typeof current.relative_humidity_2m !== 'number' ||
        typeof current.precipitation !== 'number'
      ) {
        return {
          success: false,
          error: { type: 'INCOMPLETE_DATA' },
        };
      }

      const weatherData: WeatherData = {
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        precipitation: current.precipitation,
      };

      return {
        success: true,
        data: weatherData,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): ForecastResult {
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
