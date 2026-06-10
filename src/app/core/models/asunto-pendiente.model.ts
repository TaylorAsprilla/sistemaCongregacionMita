export type TipoAsunto = 'ADMINISTRATIVO' | 'ECLESIASTICO' | 'ACTIVIDADES';

export interface TipoAsuntoOption {
  value: TipoAsunto;
  label: string;
}

export const TIPOS_ASUNTO_OPTIONS: TipoAsuntoOption[] = [
  { value: 'ADMINISTRATIVO', label: 'Administrativo' },
  { value: 'ECLESIASTICO', label: 'Eclesiastico' },
  { value: 'ACTIVIDADES', label: 'Actividades' },
];

export function normalizarTipoAsunto(tipo?: string | null): TipoAsunto | null {
  switch (tipo) {
    case 'ADMINISTRATIVO':
    case 'Administrativo':
      return 'ADMINISTRATIVO';
    case 'ECLESIASTICO':
    case 'Eclesiastico':
      return 'ECLESIASTICO';
    case 'ACTIVIDADES':
    case 'Actividades':
      return 'ACTIVIDADES';
    default:
      return null;
  }
}

export function obtenerEtiquetaTipoAsunto(tipo?: string | null): string {
  switch (normalizarTipoAsunto(tipo)) {
    case 'ADMINISTRATIVO':
      return 'Administrativo';
    case 'ECLESIASTICO':
      return 'Eclesiastico';
    case 'ACTIVIDADES':
      return 'Actividades';
    default:
      return 'Sin tipo';
  }
}

export class AsuntoPendienteModel {
  constructor(
    public id: number,
    public tipo: TipoAsunto,
    public asunto: string,
    public responsable: string,
    public informe_id: number,
    public observaciones?: string,
    public estado?: boolean,
  ) {}
}
