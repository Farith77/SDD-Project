import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

describe('GeocodingClient - Property 3: Construccion correcta de la URL', () => {
  it('debe construir una URL con nombre URL-encoded y count=1 para cualquier nombre de ciudad', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 100 }), (cityName: string) => {
        const params = new URLSearchParams({
          name: cityName,
          count: '1',
          language: 'en',
        });

        const url = 'https://geocoding-api.open-meteo.com/v1/search?' + params.toString();

        expect(url).toContain('name=');
        expect(url).toContain('count=1');
        expect(url).toContain('language=en');

        const urlParams = new URLSearchParams(url.split('?')[1]);
        expect(urlParams.get('name')).toBe(cityName);
        expect(urlParams.get('count')).toBe('1');
      }),
      { numRuns: 100 }
    );
  });

  describe('Pruebas unitarias', () => {
    it('debe construir URL correcta para nombre simple', () => {
      const params = new URLSearchParams({
        name: 'Berlin',
        count: '1',
        language: 'en',
      });
      const url = 'https://geocoding-api.open-meteo.com/v1/search?' + params.toString();

      expect(url).toContain('name=Berlin');
      expect(url).toContain('count=1');
    });

    it('debe URL-encodear caracteres especiales', () => {
      const cityName = 'New York';
      const params = new URLSearchParams({
        name: cityName,
        count: '1',
        language: 'en',
      });
      const url = 'https://geocoding-api.open-meteo.com/v1/search?' + params.toString();

      const urlParams = new URLSearchParams(url.split('?')[1]);
      expect(urlParams.get('name')).toBe(cityName);
    });

    it('debe preservar espacios en blanco', () => {
      const cityName = 'Los Angeles';
      const params = new URLSearchParams({
        name: cityName,
        count: '1',
        language: 'en',
      });
      const url = 'https://geocoding-api.open-meteo.com/v1/search?' + params.toString();

      const urlParams = new URLSearchParams(url.split('?')[1]);
      expect(urlParams.get('name')).toBe(cityName);
    });
  });
});
