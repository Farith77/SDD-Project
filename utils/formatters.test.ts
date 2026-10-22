import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatTemperature, formatHumidity, formatPrecipitation } from '../../src/utils/formatters.js';

describe('Formatters', () => {
  describe('Property 11: Formateo numerico correcto de los valores del clima', () => {
    it('temperatura debe tener maximo 1 decimal y unidad C', () => {
      fc.assert(
        fc.property(fc.float({ min: -50, max: 50, noNaN: true, noInfinity: true }), (value) => {
          const formatted = formatTemperature(value);
          expect(formatted).toContain(' C');
          expect(formatted).toMatch(/^-?\d+(\.\d)?\ C$/);
        }),
        { numRuns: 50 }
      );
    });

    it('humedad debe ser numero entero sin decimales y unidad %', () => {
      fc.assert(
        fc.property(fc.float({ min: 0, max: 100, noNaN: true, noInfinity: true }), (value) => {
          const formatted = formatHumidity(value);
          expect(formatted).toContain(' %');
          expect(formatted).toMatch(/^\d+\ %$/);
        }),
        { numRuns: 50 }
      );
    });

    it('precipitacion debe tener maximo 1 decimal y unidad mm', () => {
      fc.assert(
        fc.property(fc.float({ min: 0, max: 100, noNaN: true, noInfinity: true }), (value) => {
          const formatted = formatPrecipitation(value);
          expect(formatted).toContain(' mm');
          expect(formatted).toMatch(/^\d+(\.\d)?\ mm$/);
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Pruebas unitarias', () => {
    it('debe formatear temperatura correctamente', () => {
      expect(formatTemperature(8.4)).toBe('8.4 C');
      expect(formatTemperature(0)).toBe('0.0 C');
      expect(formatTemperature(-5.123)).toBe('-5.1 C');
      expect(formatTemperature(25.567)).toBe('25.6 C');
    });

    it('debe redondear humedad correctamente', () => {
      expect(formatHumidity(72)).toBe('72 %');
      expect(formatHumidity(72.4)).toBe('72 %');
      expect(formatHumidity(72.6)).toBe('73 %');
      expect(formatHumidity(50)).toBe('50 %');
    });

    it('debe formatear precipitacion con 1 decimal', () => {
      expect(formatPrecipitation(0.0)).toBe('0.0 mm');
      expect(formatPrecipitation(2.4)).toBe('2.4 mm');
      expect(formatPrecipitation(2.567)).toBe('2.6 mm');
      expect(formatPrecipitation(0.01)).toBe('0.0 mm');
    });
  });
});
