export class ActividadModel {
  constructor(
    public id: number,
    public fecha: Date,
    public responsable: string,
    public asistencia: number,
    public informe_id: number,
    public tipoActividad_id: number,
    public observaciones?: string,
  ) {}
}
