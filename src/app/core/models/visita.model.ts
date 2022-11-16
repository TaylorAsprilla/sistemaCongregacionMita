export class VisitaModel {
  constructor(
    public id: number,
    public fecha: Date,
    public referidaOots: number,
    public informe_id: number,
    public visitaHospital?: number,
    public observaciones?: string
  ) {}
}
