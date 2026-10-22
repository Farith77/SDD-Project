import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ForecastService } from '../../src/services/ForecastService.js';

describe('ForecastService', () => {
  let service: ForecastService;
  let fetchSpy: any;

  beforeEach(() => {
    service = new ForecastService();
    fetchSpy = vi.spyOn(global, 'fetch' as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Pruebas unitarias', () => {
    it('debe retornar datos climaticos validos (Property 7)', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 8.4,
            relative_humidity_2m: 72,
            precipitation: 0.0,
          },
        }),
      });

      const result = await service.getForecast(52.52, 13.41);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.temperature).toBe(8.4);
        expect(result.data.humidity).toBe(72);
        expect(result.data.precipitation).toBe(0.0);
      }
    });

    it('debe retornar INCOMPLETE_DATA cuando falta current (Property 10)', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await service.getForecast(0, 0);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('INCOMPLETE_DATA');
      }
    });

    it('debe retornar INCOMPLETE_DATA cuando falta temperatura (Property 10)', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: null,
            relative_humidity_2m: 72,
            precipitation: 0.0,
          },
        }),
      });

      const result = await service.getForecast(0, 0);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('INCOMPLETE_DATA');
      }
    });

    it('debe retornar SERVICE_ERROR para HTTP no-2xx (Property 8)', async () => {
      const error = new Error('HTTP 500');
      fetchSpy.mockRejectedValueOnce(error);

      const result = await service.getForecast(0, 0);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('SERVICE_ERROR');
      }
    });

    it('debe retornar TIMEOUT cuando hay AbortError', async () => {
      const abortError = new Error();
      abortError.name = 'AbortError';
      fetchSpy.mockRejectedValueOnce(abortError);

      const result = await service.getForecast(52.52, 13.41);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('TIMEOUT');
      }
    });

    it('debe retornar NETWORK_ERROR para errores de red', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await service.getForecast(52.52, 13.41);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('NETWORK_ERROR');
      }
    });
  });
});
