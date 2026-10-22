import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GeocodingService } from '../../src/services/GeocodingService.js';

describe('GeocodingService', () => {
  let service: GeocodingService;
  let fetchSpy: any;

  beforeEach(() => {
    service = new GeocodingService();
    fetchSpy = vi.spyOn(global, 'fetch' as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Pruebas unitarias', () => {
    it('debe retornar CITY_NOT_FOUND cuando no hay resultados', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] }),
      });

      const result = await service.geocode('NonexistentCity');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('CITY_NOT_FOUND');
      }
    });

    it('debe retornar coordenadas validas (Property 4)', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            { latitude: 52.52, longitude: 13.41, name: 'Berlin' },
          ],
        }),
      });

      const result = await service.geocode('Berlin');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.latitude).toBe(52.52);
        expect(result.data.longitude).toBe(13.41);
        expect(result.data.cityName).toBe('Berlin');
      }
    });

    it('debe retornar CITY_NOT_FOUND para coordenadas faltantes (Property 5)', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            { latitude: null, longitude: 13.41, name: 'Berlin' },
          ],
        }),
      });

      const result = await service.geocode('Berlin');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('CITY_NOT_FOUND');
      }
    });

    it('debe retornar SERVICE_ERROR para HTTP no-2xx (Property 8)', async () => {
      const error = new Error('HTTP 500');
      fetchSpy.mockRejectedValueOnce(error);

      const result = await service.geocode('Berlin');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('SERVICE_ERROR');
      }
    });

    it('debe retornar TIMEOUT cuando hay AbortError', async () => {
      const abortError = new Error();
      abortError.name = 'AbortError';
      fetchSpy.mockRejectedValueOnce(abortError);

      const result = await service.geocode('Berlin');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('TIMEOUT');
      }
    });

    it('debe retornar NETWORK_ERROR para errores de red', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await service.geocode('Berlin');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('NETWORK_ERROR');
      }
    });
  });
});
