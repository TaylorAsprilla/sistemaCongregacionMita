import {
  obtenerFechaInicialPeriodoInforme,
  obtenerFechasPeriodoInforme,
  obtenerPeriodoInforme,
} from './periodo-informe';

describe('período de informe', () => {
  it('conserva el tercer trimestre durante la gracia de octubre', () => {
    const fecha = new Date(2026, 9, 1, 12);

    expect(obtenerPeriodoInforme(fecha)).toEqual({ trimestre: 3, anio: 2026 });
    expect(obtenerFechasPeriodoInforme(fecha)).toEqual({ min: '2026-07-01', max: '2026-09-30' });
    expect(obtenerFechaInicialPeriodoInforme(fecha)).toBe('2026-09-30');
  });

  it('cambia al cuarto trimestre al vencer la gracia', () => {
    expect(obtenerPeriodoInforme(new Date(2026, 9, 9, 0, 4, 59)).trimestre).toBe(3);
    const fecha = new Date(2026, 9, 9, 0, 5);

    expect(obtenerFechasPeriodoInforme(fecha)).toEqual({ min: '2026-10-01', max: '2026-12-31' });
    expect(obtenerFechaInicialPeriodoInforme(fecha)).toBe('2026-10-09');
  });

  it('mantiene diciembre del año anterior durante la gracia de enero', () => {
    const fecha = new Date(2027, 0, 1, 12);

    expect(obtenerPeriodoInforme(fecha)).toEqual({ trimestre: 4, anio: 2026 });
    expect(obtenerFechasPeriodoInforme(fecha)).toEqual({ min: '2026-10-01', max: '2026-12-31' });
  });
});
