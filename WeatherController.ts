import { GeocodingService } from './services/GeocodingService.js';
import { ForecastService } from './services/ForecastService.js';
import { CitySearchForm } from './components/CitySearchForm.js';
import { WeatherDisplay } from './components/WeatherDisplay.js';
import { LoadingIndicator } from './components/LoadingIndicator.js';
import { ErrorMessage } from './components/ErrorMessage.js';
import type { AppState } from './types/index.js';

export class WeatherController {
  private geocodingService: GeocodingService;
  private forecastService: ForecastService;
  private citySearchForm: CitySearchForm;
  private weatherDisplay: WeatherDisplay;
  private loadingIndicator: LoadingIndicator;
  private errorMessage: ErrorMessage;
  private appState: AppState = { status: 'idle' };

  constructor(container: HTMLElement) {
    this.geocodingService = new GeocodingService();
    this.forecastService = new ForecastService();
    this.citySearchForm = new CitySearchForm(container);
    this.weatherDisplay = new WeatherDisplay(container);
    this.loadingIndicator = new LoadingIndicator(container);
    this.errorMessage = new ErrorMessage(container);

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.citySearchForm.onSearch((cityName) => {
      this.handleSearch(cityName).catch((err) => {
        console.error('Search error:', err);
        this.showError('An unexpected error occurred');
      });
    });
  }

  private async handleSearch(cityName: string): Promise<void> {
    this.clearUI();
    this.setLoading(true);

    try {
      const geocodeResult = await this.geocodingService.geocode(cityName);

      if (!geocodeResult.success) {
        this.showError(this.getErrorMessage(geocodeResult.error.type));
        return;
      }

      const coordinates = geocodeResult.data;

      const forecastResult = await this.forecastService.getForecast(
        coordinates.latitude,
        coordinates.longitude
      );

      if (!forecastResult.success) {
        this.showError(this.getErrorMessage(forecastResult.error.type));
        return;
      }

      this.setSuccess(coordinates.cityName, forecastResult.data);
    } finally {
      this.setLoading(false);
    }
  }

  private clearUI(): void {
    this.weatherDisplay.clear();
    this.errorMessage.clear();
  }

  private setLoading(loading: boolean): void {
    if (loading) {
      this.loadingIndicator.show();
    } else {
      this.loadingIndicator.hide();
    }
  }

  private setSuccess(cityName: string, weather: any): void {
    this.appState = {
      status: 'success',
      cityName,
      weather,
    };
    this.weatherDisplay.render(cityName, weather);
  }

  private showError(message: string): void {
    this.appState = {
      status: 'error',
      message,
    };
    this.errorMessage.show(message);
  }

  private getErrorMessage(errorType: string): string {
    const messages: Record<string, string> = {
      CITY_NOT_FOUND: 'City not found. Please check the name and try again.',
      NETWORK_ERROR: 'Network error. Please check your connection.',
      TIMEOUT: 'Request timed out. Please try again.',
      SERVICE_ERROR: 'Service error. Please try again later.',
      INVALID_RESPONSE: 'Invalid response from service.',
      INCOMPLETE_DATA: 'Incomplete weather data received.',
    };
    return messages[errorType] || 'An error occurred';
  }

  getAppState(): AppState {
    return this.appState;
  }
}
