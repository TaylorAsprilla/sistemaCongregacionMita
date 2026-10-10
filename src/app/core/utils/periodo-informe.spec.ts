import {
  obtenerFechaInicialPeriodoInforme,
  obtenerFechaCierreInforme,
  obtenerFechasPeriodoInforme,
  formatearFechaCierreLocal,
  obtenerPeriodoInforme,
  obtenerPeriodoInformeDesdeFecha,
} from './periodo-informe';

describe('período de informe', () => {
  it('conserva el tercer trimestre hasta el 13 de octubre', () => {
    const fecha = new Date('2026-10-01T17:00:00Z');

    expect(obtenerPeriodoInforme(fecha)).toEqual({ trimestre: 3, anio: 2026 });
    expect(obtenerFechasPeriodoInforme(fecha)).toEqual({ min: '2026-07-01', max: '2026-09-30' });
    expect(obtenerFechaInicialPeriodoInforme(fecha)).toBe('2026-09-30');

    const ultimoDia = new Date('2026-10-14T04:59:59Z');
    expect(obtenerPeriodoInforme(ultimoDia)).toEqual({ trimestre: 3, anio: 2026 });
    expect(obtenerFechasPeriodoInforme(ultimoDia)).toEqual({ min: '2026-07-01', max: '2026-09-30' });
  });

  it('cambia al cuarto trimestre el 14 de octubre al vencer la gracia', () => {
    expect(obtenerPeriodoInforme(new Date('2026-10-14T05:04:59Z')).trimestre).toBe(3);
    const fecha = new Date('2026-10-14T05:05:00Z');

    expect(obtenerFechasPeriodoInforme(fecha)).toEqual({ min: '2026-10-01', max: '2026-12-31' });
    expect(obtenerFechaInicialPeriodoInforme(fecha)).toBe('2026-10-14');
  });

  it('mantiene diciembre del año anterior durante la gracia de enero', () => {
    const fecha = new Date('2027-01-01T17:00:00Z');

    expect(obtenerPeriodoInforme(fecha)).toEqual({ trimestre: 4, anio: 2026 });
    expect(obtenerFechasPeriodoInforme(fecha)).toEqual({ min: '2026-10-01', max: '2026-12-31' });
    expect(obtenerFechaCierreInforme(4, 2026).toISOString()).toBe('2027-01-08T05:05:00.000Z');
  });

  it('cierra los trimestres habituales el día 8 del mes siguiente a las 05:05 UTC', () => {
    expect(obtenerFechaCierreInforme(1, 2026).toISOString()).toBe('2026-04-08T05:05:00.000Z');
    expect(obtenerFechaCierreInforme(2, 2026).toISOString()).toBe('2026-07-08T05:05:00.000Z');
    expect(obtenerFechaCierreInforme(3, 2027).toISOString()).toBe('2027-10-08T05:05:00.000Z');
    expect(obtenerPeriodoInforme(new Date('2027-01-08T05:04:59Z'))).toEqual({ trimestre: 4, anio: 2026 });
    expect(obtenerPeriodoInforme(new Date('2027-01-08T05:05:00Z'))).toEqual({ trimestre: 1, anio: 2027 });
  });

  it('obtiene el trimestre y año de la fecha del informe', () => {
    expect(obtenerPeriodoInformeDesdeFecha('2026-07-15T00:00:00.000Z')).toEqual({ trimestre: 3, anio: 2026 });
    expect(obtenerPeriodoInformeDesdeFecha('2025-12-31')).toEqual({ trimestre: 4, anio: 2025 });
    expect(obtenerPeriodoInformeDesdeFecha('fecha-invalida')).toBeNull();
  });

  it('fija el cierre del tercer trimestre y lo presenta en la zona horaria local indicada', () => {
    const cierre = obtenerFechaCierreInforme(3, 2026);

    expect(cierre.toISOString()).toBe('2026-10-14T05:05:00.000Z');
    const colombia = formatearFechaCierreLocal(cierre, 'America/Bogota');
    const toronto = formatearFechaCierreLocal(cierre, 'America/Toronto');
    const ciudadMexico = formatearFechaCierreLocal(cierre, 'America/Mexico_City');

    expect(colombia).toContain('miércoles, 14 de octubre de 2026, 12:05 a. m.');
    expect(colombia).toContain('hora estándar de Colombia');
    expect(toronto).toContain('miércoles, 14 de octubre de 2026, 1:05 a. m.');
    expect(toronto).toContain('hora de verano oriental');
    expect(ciudadMexico).toContain('martes, 13 de octubre de 2026, 11:05 p. m.');
    expect(ciudadMexico).toContain('hora estándar central');
  });
});
