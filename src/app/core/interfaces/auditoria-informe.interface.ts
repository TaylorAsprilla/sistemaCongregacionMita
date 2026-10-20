export interface RegistroAuditoriaInforme {
  id: number;
  seccion: string;
  registro_id: number | null;
  accion: string;
  usuario_id: number | null;
  usuario: string | null;
  fecha: string;
  cambios: unknown;
}
