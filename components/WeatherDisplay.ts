import type { WeatherData } from '../types/index.js';
import { formatTemperature, formatHumidity, formatPrecipitation } from '../utils/formatters.js';

/**
 * WeatherDisplay Component
 * Renders formatted weather data
 */
export class WeatherDisplay {
  private container: HTMLElement;
  private display: HTMLDivElement;
  private cityNameElement: HTMLElement;
  private temperatureElement: HTMLElement;
  private humidityElement: HTMLElement;
  private precipitationElement: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.display = container.querySelector('#weather-display') as HTMLDivElement;
    this.cityNameElement = container.querySelector('#city-name') as HTMLElement;
    this.temperatureElement = container.querySelector('#temperature') as HTMLElement;
    this.humidityElement = container.querySelector('#humidity') as HTMLElement;
    this.precipitationElement = container.querySelector('#precipitation') as HTMLElement;
  }

  /**
   * Render weather data (Property 12)
   * Display must contain all fields with units
   */
  render(cityName: string, weather: WeatherData): void {
    // Fallback to user input if cityName is empty (from requirements)
    const displayName = cityName || 'Unknown City';

    this.cityNameElement.textContent = displayName;
    this.temperatureElement.textContent = formatTemperature(weather.temperature);
    this.humidityElement.textContent = formatHumidity(weather.humidity);
    this.precipitationElement.textContent = formatPrecipitation(weather.precipitation);

    this.show();
  }

  /**
   * Clear the display (Property 13)
   */
  clear(): void {
    this.cityNameElement.textContent = '';
    this.temperatureElement.textContent = '';
    this.humidityElement.textContent = '';
    this.precipitationElement.textContent = '';
    this.hide();
  }

  /**
   * Show the display
   */
  show(): void {
    this.display.classList.remove('hidden');
  }

  /**
   * Hide the display
   */
  hide(): void {
    this.display.classList.add('hidden');
  }

  /**
   * Check if display is visible
   */
  isVisible(): boolean {
    return !this.display.classList.contains('hidden');
  }

  /**
   * Get the container (for testing)
   */
  getContainer(): HTMLDivElement {
    return this.display;
  }

  /**
   * Get rendered text content (for testing)
   */
  getRenderedText(): {
    cityName: string;
    temperature: string;
    humidity: string;
    precipitation: string;
  } {
    return {
      cityName: this.cityNameElement.textContent || '',
      temperature: this.temperatureElement.textContent || '',
      humidity: this.humidityElement.textContent || '',
      precipitation: this.precipitationElement.textContent || '',
    };
  }
}
