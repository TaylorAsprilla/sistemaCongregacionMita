import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByNombrePipe',
})
export class FilterByNombrePipePipe implements PipeTransform {
  transform(values: any[], filtroNombre: string): any {
    if (!values || !filtroNombre) {
      return values;
    }

    console.log(values, filtroNombre);

    return values.filter((value) => value.pais.toLowerCase().includes(filtroNombre.toLowerCase()));
  }
}
