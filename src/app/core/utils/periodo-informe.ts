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
  return new Date(Date.UTC(anio, trimestre * 3, 10, 5, 5));
}

export function obtenerHorariosCierrePorPais(fechaCierre: Date): { pais: string; hora: string }[] {
  const paises = [
    { pais: 'Canadá (hora de Toronto)', zona: 'America/Toronto' },
    { pais: 'Chile (hora de Santiago)', zona: 'America/Santiago' },
    { pais: 'Colombia', zona: 'America/Bogota' },
    { pais: 'Costa Rica', zona: 'America/Costa_Rica' },
    { pais: 'Ecuador (continental)', zona: 'America/Guayaquil' },
    { pais: 'El Salvador', zona: 'America/El_Salvador' },
    { pais: 'España (hora de Madrid)', zona: 'Europe/Madrid' },
    { pais: 'Estados Unidos (hora del Este)', zona: 'America/New_York' },
    { pais: 'Italia', zona: 'Europe/Rome' },
    { pais: 'México (hora de Ciudad de México)', zona: 'America/Mexico_City' },
    { pais: 'Panamá', zona: 'America/Panama' },
    { pais: 'Puerto Rico', zona: 'America/Puerto_Rico' },
    { pais: 'República Dominicana', zona: 'America/Santo_Domingo' },
    { pais: 'Venezuela', zona: 'America/Caracas' },
  ];

  return paises.map(({ pais, zona }) => ({
    pais,
    hora: new Intl.DateTimeFormat('es-CO', {
      timeZone: zona,
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hourCycle: 'h12',
    }).format(fechaCierre),
  }));
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
