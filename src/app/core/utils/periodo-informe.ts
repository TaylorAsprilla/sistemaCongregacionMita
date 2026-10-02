export const DIAS_GRACIA_CIERRE_INFORME = 8;

function formatearFechaLocal(fecha: Date): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

export function obtenerPeriodoInforme(fecha: Date = new Date()): { trimestre: number; anio: number } {
  let trimestre = Math.floor(fecha.getMonth() / 3) + 1;
  let anio = fecha.getFullYear();
  const fechaCierre = new Date(anio, (trimestre - 1) * 3, 1 + DIAS_GRACIA_CIERRE_INFORME, 0, 5);

  if (fecha < fechaCierre) {
    trimestre -= 1;
    if (trimestre === 0) {
      trimestre = 4;
      anio -= 1;
    }
  }

  return { trimestre, anio };
}

export function obtenerFechasPeriodoInforme(fecha: Date = new Date()): { min: string; max: string } {
  const { trimestre, anio } = obtenerPeriodoInforme(fecha);
  const primerMes = (trimestre - 1) * 3;
  return {
    min: formatearFechaLocal(new Date(anio, primerMes, 1)),
    max: formatearFechaLocal(new Date(anio, primerMes + 3, 0)),
  };
}

export function obtenerFechaInicialPeriodoInforme(fecha: Date = new Date()): string {
  const { max } = obtenerFechasPeriodoInforme(fecha);
  const hoy = formatearFechaLocal(fecha);
  return hoy > max ? max : hoy;
}
