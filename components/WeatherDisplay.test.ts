import { describe, it, expect, beforeEach } from 'vitest';
import { WeatherDisplay } from './WeatherDisplay.js';

describe('WeatherDisplay - Property 12 & 13', () => {
  let display;
  let container;

  beforeEach(() => {
    document.body.innerHTML = '<div id=\"app\"><div id=\"weather-display\" class=\"hidden\"><h2 id=\"city-name\"></h2><div id=\"temperature\"></div><div id=\"humidity\"></div><div id=\"precipitation\"></div></div></div>';
    container = document.getElementById('app');
    display = new WeatherDisplay(container);
  });

  it('Property 12: renderiza todos los campos con unidades', () => {
    const weather = { temperature: 8.4, humidity: 72, precipitation: 0.5 };
    display.render('Berlin', weather);
    expect(display.getContainer().textContent).toContain('Berlin');
    expect(display.getContainer().textContent).toContain('C');
    expect(display.getContainer().textContent).toContain('%');
    expect(display.getContainer().textContent).toContain('mm');
  });

  it('Property 12: renderizado completo', () => {
    const weather = { temperature: 8.4, humidity: 72, precipitation: 0.5 };
    display.render('Berlin', weather);
    const rendered = display.getRenderedText();
    expect(rendered.cityName).toBe('Berlin');
    expect(rendered.temperature).toContain('C');
    expect(rendered.humidity).toContain('%');
    expect(rendered.precipitation).toContain('mm');
  });

  it('Property 13: limpia el display', () => {
    const weather = { temperature: 8.4, humidity: 72, precipitation: 0.5 };
    display.render('Berlin', weather);
    expect(display.isVisible()).toBe(true);
    display.clear();
    expect(display.isVisible()).toBe(false);
    const rendered = display.getRenderedText();
    expect(rendered.cityName).toBe('');
  });

  it('debe formatear correctamente', () => {
    const weather = { temperature: 8.456, humidity: 72.8, precipitation: 2.345 };
    display.render('Berlin', weather);
    const rendered = display.getRenderedText();
    expect(rendered.temperature).toBe('8.5 C');
    expect(rendered.humidity).toBe('73 %');
    expect(rendered.precipitation).toBe('2.3 mm');
  });

  it('debe usar fallback a Unknown City', () => {
    const weather = { temperature: 8.4, humidity: 72, precipitation: 0.5 };
    display.render('', weather);
    const rendered = display.getRenderedText();
    expect(rendered.cityName).toBe('Unknown City');
  });
});
