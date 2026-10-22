import { WeatherController } from './WeatherController.js';

const appContainer = document.getElementById('app') as HTMLElement;
const controller = new WeatherController(appContainer);

console.log('Weather Forecast App initialized with WeatherController');
