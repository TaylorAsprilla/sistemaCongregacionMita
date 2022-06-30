export class VisitaModel {
  constructor(
    public id: number,
    public fecha: Date,
    public visitasHogares: number,
    public referidaOots: number,
    public informe_id: number,
    public cantidad?: number,
    public efectivo?: number,
    public visitaHospital?: number,
    public observaciones?: string
  ) {}
}
