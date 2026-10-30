const formato = new Intl.NumberFormat('es-CO', {
  useGrouping: true,
  maximumFractionDigits: 0,
});

export function formatearNumeroMita(numero: number): string {
  return formato.format(numero);
}
