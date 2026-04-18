export type TipoAsunto = 'Administrativo' | 'Eclesiastico' | 'Actividades';

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
