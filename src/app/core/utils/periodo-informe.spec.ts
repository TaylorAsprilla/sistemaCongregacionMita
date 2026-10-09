import {
  obtenerFechaInicialPeriodoInforme,
  obtenerFechaCierreInforme,
  obtenerFechasPeriodoInforme,
  obtenerHorariosCierrePorPais,
  obtenerPeriodoInforme,
  obtenerPeriodoInformeDesdeFecha,
} from './periodo-informe';

describe('período de informe', () => {
  it('conserva el tercer trimestre durante la gracia de octubre', () => {
    const fecha = new Date('2026-10-01T17:00:00Z');

    expect(obtenerPeriodoInforme(fecha)).toEqual({ trimestre: 3, anio: 2026 });
    expect(obtenerFechasPeriodoInforme(fecha)).toEqual({ min: '2026-07-01', max: '2026-09-30' });
    expect(obtenerFechaInicialPeriodoInforme(fecha)).toBe('2026-09-30');
  });

  it('cambia al cuarto trimestre al vencer la gracia', () => {
    expect(obtenerPeriodoInforme(new Date('2026-10-10T05:04:59Z')).trimestre).toBe(3);
    const fecha = new Date('2026-10-10T05:05:00Z');

    expect(obtenerFechasPeriodoInforme(fecha)).toEqual({ min: '2026-10-01', max: '2026-12-31' });
    expect(obtenerFechaInicialPeriodoInforme(fecha)).toBe('2026-10-10');
  });

  it('mantiene diciembre del año anterior durante la gracia de enero', () => {
    const fecha = new Date('2027-01-01T17:00:00Z');

    expect(obtenerPeriodoInforme(fecha)).toEqual({ trimestre: 4, anio: 2026 });
    expect(obtenerFechasPeriodoInforme(fecha)).toEqual({ min: '2026-10-01', max: '2026-12-31' });
  });

  it('obtiene el trimestre y año de la fecha del informe', () => {
    expect(obtenerPeriodoInformeDesdeFecha('2026-07-15T00:00:00.000Z')).toEqual({ trimestre: 3, anio: 2026 });
    expect(obtenerPeriodoInformeDesdeFecha('2025-12-31')).toEqual({ trimestre: 4, anio: 2025 });
    expect(obtenerPeriodoInformeDesdeFecha('fecha-invalida')).toBeNull();
  });

  it('fija el cierre del tercer trimestre a las 12:05 a. m. de Colombia y muestra conversiones locales', () => {
    const cierre = obtenerFechaCierreInforme(3, 2026);

    expect(cierre.toISOString()).toBe('2026-10-10T05:05:00.000Z');
    const horarios = obtenerHorariosCierrePorPais(cierre);
    expect(horarios).toContain(jasmine.objectContaining({ pais: 'Colombia' }));
    expect(horarios.find((horario) => horario.pais === 'Colombia')?.hora).toContain('12:05 a. m.');
    expect(horarios).toHaveSize(14);
  });
});
