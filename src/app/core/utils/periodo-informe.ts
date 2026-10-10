export const ZONA_HORARIA_COLOMBIA = 'America/Bogota';

function formatearFechaLocal(fecha: Date): string {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA_HORARIA_COLOMBIA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(fecha);
  const valores = Object.fromEntries(partes.map(({ type, value }) => [type, value]));
  return `${valores['year']}-${valores['month']}-${valores['day']}`;
}

function obtenerPartesFechaColombia(fecha: Date): { anio: number; mes: number } {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONA_HORARIA_COLOMBIA,
    year: 'numeric',
    month: 'numeric',
  }).formatToParts(fecha);

  return {
    anio: Number(partes.find((parte) => parte.type === 'year')?.value),
    mes: Number(partes.find((parte) => parte.type === 'month')?.value) - 1,
  };
}

export function obtenerFechaCierreInforme(trimestre: number, anio: number): Date {
  const diaCierre = trimestre === 3 && anio === 2026 ? 14 : 10;
  return new Date(Date.UTC(anio, trimestre * 3, diaCierre, 5, 5));
}

export function formatearFechaCierreLocal(
  fechaCierre: Date,
  zonaHoraria: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
): string {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: zonaHoraria,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hourCycle: 'h12',
    timeZoneName: 'long',
  }).format(fechaCierre);
}

export function obtenerPeriodoInforme(fecha: Date = new Date()): { trimestre: number; anio: number } {
  const { anio: anioColombia, mes } = obtenerPartesFechaColombia(fecha);
  let trimestre = Math.floor(mes / 3) + 1;
  let anio = anioColombia;
  const fechaCierre = obtenerFechaCierreInforme(trimestre, anio);

  if (fecha < fechaCierre) {
    trimestre -= 1;
    if (trimestre === 0) {
      trimestre = 4;
      anio -= 1;
    }
  }

  return { trimestre, anio };
}

export function obtenerPeriodoInformeDesdeFecha(fechaInforme: string): { trimestre: number; anio: number } | null {
  const coincidencia = fechaInforme.match(/^(\d{4})-(\d{2})-/);
  if (!coincidencia) {
    return null;
  }

  const anio = Number(coincidencia[1]);
  const mes = Number(coincidencia[2]);
  if (mes < 1 || mes > 12) {
    return null;
  }

  return { trimestre: Math.floor((mes - 1) / 3) + 1, anio };
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
