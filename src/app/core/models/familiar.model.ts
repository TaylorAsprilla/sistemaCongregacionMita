export class FamiliarModel {
  constructor(
    public id: number,
    public nombre: string,
    public celular: string,
    public parentesco_id: number,
    public pais: string,
    public email?: string,
    public telefono?: string
  ) {}
}
