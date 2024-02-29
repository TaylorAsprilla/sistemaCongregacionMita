import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calcularEdad',
})
export class CalcularEdadPipe implements PipeTransform {
  transform(fechaNacimiento: Date): number {
    if (!fechaNacimiento) {
      return null;
    }

    const fechaNacimientoDate = new Date(fechaNacimiento);
    const diferencia = Date.now() - fechaNacimientoDate.getTime();
    const edadEnAnios = Math.floor(diferencia / (365.25 * 24 * 60 * 60 * 1000));
    return edadEnAnios;
  }
}
