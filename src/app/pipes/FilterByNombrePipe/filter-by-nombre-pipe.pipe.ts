import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByNombrePipe',
})
export class FilterByNombrePipePipe implements PipeTransform {
  transform(items: any[], fieldName: string, filterValue: string): any[] {
    if (!items || !fieldName || !filterValue) {
      return items;
    }

    return items.filter((item) => item[fieldName].toLowerCase().includes(filterValue.toLowerCase()));
  }
}
