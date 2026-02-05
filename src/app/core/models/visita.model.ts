export class VisitaModel {
  constructor(
    public id: number,
    public mes: number,
    public visitasHogares: number,
    public referidasOots: number,
    public visitaHospital: number,
    public informe_id: number,
    public observaciones?: string,
    public estado?: boolean,
  ) {}
}
