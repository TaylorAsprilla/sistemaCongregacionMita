export class AsuntoPendienteModel {
  constructor(
    public id: number,
    public asunto: string,
    public responsable: string,
    public estado: boolean,
    public informe_id: number,
    public observaciones?: string
  ) {}
}
