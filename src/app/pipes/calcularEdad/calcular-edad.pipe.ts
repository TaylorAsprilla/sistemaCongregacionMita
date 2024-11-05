import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calcularEdad',
})
export class CalcularEdadPipe implements PipeTransform {
  transform(fechaNacimiento: Date | string): number {
    if (!fechaNacimiento) {
      return 0; // Retorna 0 en lugar de null
    }

    // Convertir a objeto Date si es necesario
    const fechaNacimientoDate = typeof fechaNacimiento === 'string' ? new Date(fechaNacimiento) : fechaNacimiento;

    // Validar la fecha
    if (isNaN(fechaNacimientoDate.getTime())) {
      return 0; // Retorna 0 si la fecha es inválida
    }

    const ahora = new Date();
    const edadEnAnios = ahora.getFullYear() - fechaNacimientoDate.getFullYear();
    const mesDiff = ahora.getMonth() - fechaNacimientoDate.getMonth();

    // Ajusta si el cumpleaños no ha ocurrido todavía este año
    if (mesDiff < 0 || (mesDiff === 0 && ahora.getDate() < fechaNacimientoDate.getDate())) {
      return edadEnAnios - 1;
    }

    return edadEnAnios;
  }
}
