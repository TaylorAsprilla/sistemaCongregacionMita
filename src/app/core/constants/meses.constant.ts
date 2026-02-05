export interface MesItem {
  valor: number;
  nombre: string;
}

export const MESES: MesItem[] = [
  { valor: 1, nombre: 'Enero' },
  { valor: 2, nombre: 'Febrero' },
  { valor: 3, nombre: 'Marzo' },
  { valor: 4, nombre: 'Abril' },
  { valor: 5, nombre: 'Mayo' },
  { valor: 6, nombre: 'Junio' },
  { valor: 7, nombre: 'Julio' },
  { valor: 8, nombre: 'Agosto' },
  { valor: 9, nombre: 'Septiembre' },
  { valor: 10, nombre: 'Octubre' },
  { valor: 11, nombre: 'Noviembre' },
  { valor: 12, nombre: 'Diciembre' },
];

/**
 * Obtiene el nombre del mes dado su valor numérico (1-12)
 * @param mes Número del mes (1-12)
 * @returns Nombre del mes o 'N/A' si no es válido
 */
export function getNombreMes(mes: number): string {
  const mesEncontrado = MESES.find((m) => m.valor === mes);
  return mesEncontrado ? mesEncontrado.nombre : 'N/A';
}

/**
 * Obtiene los meses del trimestre actual
 * @returns Array de meses del trimestre actual
 */
export function obtenerMesesTrimestreActual(): MesItem[] {
  const mesActual = new Date().getMonth() + 1; // getMonth() devuelve 0-11
  const trimestre = Math.ceil(mesActual / 3);
  const primerMesTrimestre = (trimestre - 1) * 3 + 1;
  const ultimoMesTrimestre = trimestre * 3;

  return MESES.filter((mes) => mes.valor >= primerMesTrimestre && mes.valor <= ultimoMesTrimestre);
}
