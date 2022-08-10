export class NacionalidadModel {
  constructor(
    public id: number,
    public nombre: string,
    public iso2: string,
    public iso3: string,
    public telefonoCode: number
  ) {}
}
