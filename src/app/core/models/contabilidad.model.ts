export class ContabilidadModel {
  constructor(
    public id: number,
    public sobres: number,
    public restrictos: string,
    public noRestrictos: number,
    public informe_id: number
  ) {}
}
