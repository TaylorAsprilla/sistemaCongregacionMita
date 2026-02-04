export class ActividadEconomicaModel {
  constructor(
    public id: number,
    public fecha: string,
    public cantidadRecaudada: number,
    public responsable: string,
    public asistencia: number,
    public observaciones: string,
    public informe_id: number,
    public tipoActividadEconomica_id: number,
  ) {}
}
