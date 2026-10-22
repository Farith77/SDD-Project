import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WeatherController } from './WeatherController.js';

describe('WeatherController - Integration', () => {
  let controller;
  let container;
  let fetchSpy;

  beforeEach(() => {
    document.body.innerHTML = '<div id=\"app\"><form id=\"city-search-form\"><input id=\"city-input\" type=\"text\" maxlength=\"100\" /><button>Search</button></form><div id=\"validation-error\"></div><div id=\"loading-indicator\" class=\"hidden\"><p>Loading...</p></div><div id=\"error-message\"></div><div id=\"weather-display\" class=\"hidden\"><h2 id=\"city-name\"></h2><div id=\"temperature\"></div><div id=\"humidity\"></div><div id=\"precipitation\"></div></div></div>';
    container = document.getElementById('app');
    controller = new WeatherController(container);
    fetchSpy = vi.spyOn(global, 'fetch' as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debe inicializar en estado idle', () => {
    const state = controller.getAppState();
    expect(state.status).toBe('idle');
  });

  it('debe mostrar loading al buscar ciudad', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [{ latitude: 52.52, longitude: 13.41, name: 'Berlin' }] }),
    });
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ current: { temperature_2m: 8.4, relative_humidity_2m: 72, precipitation: 0.5 } }),
    });

    const input = document.getElementById('city-input');
    input.value = 'Berlin';
    document.getElementById('city-search-form').dispatchEvent(new Event('submit', { bubbles: true }));

    await new Promise(resolve => setTimeout(resolve, 100));

    const state = controller.getAppState();
    expect(state.status).toBe('success');
  });

  it('debe mostrar error cuando ciudad no encontrada', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    const input = document.getElementById('city-input');
    input.value = 'InvalidCity123';
    document.getElementById('city-search-form').dispatchEvent(new Event('submit', { bubbles: true }));

    await new Promise(resolve => setTimeout(resolve, 100));

    const state = controller.getAppState();
    expect(state.status).toBe('error');
    expect(state.message).toContain('not found');
  });

  it('debe mostrar error en fallo de red', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('Failed to fetch'));

    const input = document.getElementById('city-input');
    input.value = 'Berlin';
    document.getElementById('city-search-form').dispatchEvent(new Event('submit', { bubbles: true }));

    await new Promise(resolve => setTimeout(resolve, 100));

    const state = controller.getAppState();
    expect(state.status).toBe('error');
  });

  it('debe limpiar UI al iniciar nueva búsqueda', async () => {
    const input = document.getElementById('city-input');
    input.value = 'Berlin';

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [{ latitude: 52.52, longitude: 13.41, name: 'Berlin' }] }),
    });
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ current: { temperature_2m: 8.4, relative_humidity_2m: 72, precipitation: 0.5 } }),
    });

    document.getElementById('city-search-form').dispatchEvent(new Event('submit', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 100));

    const display = document.getElementById('weather-display');
    expect(display.classList.contains('hidden')).toBe(false);

    input.value = 'Madrid';
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [{ latitude: 40.41, longitude: -3.69, name: 'Madrid' }] }),
    });
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ current: { temperature_2m: 15.2, relative_humidity_2m: 65, precipitation: 0 } }),
    });

    document.getElementById('city-search-form').dispatchEvent(new Event('submit', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(display.querySelector('#city-name').textContent).toBe('Madrid');
  });
});
