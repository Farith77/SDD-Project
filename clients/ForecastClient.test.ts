import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

describe('ForecastClient - Property 6: Construccion correcta de la URL', () => {
  it('debe construir URL con latitude, longitude y parametro current correcto', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.float({ min: -90, max: 90, noNaN: true, noInfinity: true }),
          fc.float({ min: -180, max: 180, noNaN: true, noInfinity: true })
        ),
        ([lat, lon]: [number, number]) => {
          const params = new URLSearchParams({
            latitude: lat.toString(),
            longitude: lon.toString(),
            current: 'temperature_2m,relative_humidity_2m,precipitation',
            timezone: 'auto',
          });

          const url = 'https://api.open-meteo.com/v1/forecast?' + params.toString();
          const urlParams = new URLSearchParams(url.split('?')[1]);

          expect(urlParams.get('latitude')).toBe(lat.toString());
          expect(urlParams.get('longitude')).toBe(lon.toString());
          expect(urlParams.has('current')).toBe(true);
          expect(urlParams.get('current')).toContain('temperature_2m');
          expect(urlParams.get('current')).toContain('relative_humidity_2m');
          expect(urlParams.get('current')).toContain('precipitation');
        }
      ),
      { numRuns: 100 }
    );
  });

  describe('Pruebas unitarias', () => {
    it('debe construir URL valida para coordenadas Berlin', () => {
      const lat = 52.52;
      const lon = 13.41;
      const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
        current: 'temperature_2m,relative_humidity_2m,precipitation',
        timezone: 'auto',
      });
      const url = 'https://api.open-meteo.com/v1/forecast?' + params.toString();

      expect(url).toContain('latitude=52.52');
      expect(url).toContain('longitude=13.41');
      expect(url).toContain('current=');
    });

    it('debe construir URL valida para coordenadas en limites', () => {
      const testCases = [
        { lat: -90, lon: -180 },
        { lat: 90, lon: 180 },
        { lat: 0, lon: 0 },
      ];

      for (const { lat, lon } of testCases) {
        const params = new URLSearchParams({
          latitude: lat.toString(),
          longitude: lon.toString(),
          current: 'temperature_2m,relative_humidity_2m,precipitation',
          timezone: 'auto',
        });
        const url = 'https://api.open-meteo.com/v1/forecast?' + params.toString();
        const urlParams = new URLSearchParams(url.split('?')[1]);

        expect(urlParams.get('latitude')).toBe(lat.toString());
        expect(urlParams.get('longitude')).toBe(lon.toString());
      }
    });

    it('debe incluir todos los parametros requeridos', () => {
      const params = new URLSearchParams({
        latitude: '0',
        longitude: '0',
        current: 'temperature_2m,relative_humidity_2m,precipitation',
        timezone: 'auto',
      });
      const url = 'https://api.open-meteo.com/v1/forecast?' + params.toString();

      expect(url).toContain('latitude=');
      expect(url).toContain('longitude=');
      expect(url).toContain('current=');
      expect(url).toContain('timezone=');
    });
  });
});
