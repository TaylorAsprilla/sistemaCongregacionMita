export class SituacionVisitaModel {
  constructor(
    public id: number,
    public fecha: Date,
    public nombreFeligres: string,
    public informe_id: number,
    public situacion?: string,
    public intervension?: string,
    public seguimiento?: string,
    public observaciones?: string,
    public estado?: boolean,
  ) {}
}
