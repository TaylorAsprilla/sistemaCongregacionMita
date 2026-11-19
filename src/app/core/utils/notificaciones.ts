const MINUTO = 60_000;
const HORA = 60 * MINUTO;
const DIA = 24 * HORA;

/** Solo rutas internas del sistema: evita navegar a destinos externos si el dato llegara manipulado. */
export function urlDestinoSegura(url: string | null | undefined): string | null {
  return typeof url === 'string' && /^\/sistema\/[A-Za-z0-9\-_/?=&%.]*$/.test(url) ? url : null;
}

/** "ahora", "hace 5 min", "hace 3 h", "ayer" o la fecha corta. */
export function tiempoRelativo(fecha: string | Date, ahora: Date = new Date()): string {
  const momento = new Date(fecha);
  if (Number.isNaN(momento.getTime())) return '';
  const diferencia = ahora.getTime() - momento.getTime();

  if (diferencia < MINUTO) return 'ahora';
  if (diferencia < HORA) return `hace ${Math.floor(diferencia / MINUTO)} min`;
  if (diferencia < DIA) return `hace ${Math.floor(diferencia / HORA)} h`;
  if (diferencia < 2 * DIA) return 'ayer';
  if (diferencia < 7 * DIA) return `hace ${Math.floor(diferencia / DIA)} días`;
  return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }).format(momento);
}

/** Fecha y hora completas para el tooltip: "18 nov 2026, 3:05 p. m.". */
export function fechaHoraCompleta(fecha: string | Date): string {
  const momento = new Date(fecha);
  if (Number.isNaN(momento.getTime())) return '';
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(momento);
}
