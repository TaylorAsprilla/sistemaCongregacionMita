import { fechaHoraCompleta, tiempoRelativo, urlDestinoSegura } from './notificaciones';

describe('utilidades de notificaciones', () => {
  describe('urlDestinoSegura', () => {
    it('acepta solo rutas internas del sistema', () => {
      expect(urlDestinoSegura('/sistema/ver-informe/12')).toBe('/sistema/ver-informe/12');
      expect(urlDestinoSegura('/sistema/dashboard-supervision?anio=2026&trimestre=3')).toContain('trimestre=3');
    });

    it('rechaza destinos externos, protocolos peligrosos y valores vacíos', () => {
      for (const malo of [
        'https://malo.example/robo',
        '//malo.example',
        'javascript:alert(1)',
        '/otra/ruta',
        '/sistema/<script>',
        '',
        null,
        undefined,
      ]) {
        expect(urlDestinoSegura(malo as any)).withContext(String(malo)).toBeNull();
      }
    });
  });

  describe('tiempoRelativo', () => {
    const ahora = new Date('2026-11-18T15:00:00Z');
    const hace = (ms: number) => new Date(ahora.getTime() - ms);

    it('expresa la antigüedad en lenguaje natural', () => {
      expect(tiempoRelativo(hace(10_000), ahora)).toBe('ahora');
      expect(tiempoRelativo(hace(5 * 60_000), ahora)).toBe('hace 5 min');
      expect(tiempoRelativo(hace(3 * 3_600_000), ahora)).toBe('hace 3 h');
      expect(tiempoRelativo(hace(30 * 3_600_000), ahora)).toBe('ayer');
      expect(tiempoRelativo(hace(4 * 86_400_000), ahora)).toBe('hace 4 días');
    });

    it('pasada una semana muestra la fecha y tolera valores inválidos', () => {
      expect(tiempoRelativo(hace(20 * 86_400_000), ahora)).toMatch(/2026/);
      expect(tiempoRelativo('no es fecha', ahora)).toBe('');
      expect(fechaHoraCompleta('no es fecha')).toBe('');
      expect(fechaHoraCompleta('2026-11-18T15:05:00Z')).toMatch(/2026/);
    });
  });
});
