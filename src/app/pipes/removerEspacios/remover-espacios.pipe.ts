import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removerEspacios',
})
export class RemoverEspaciosPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    return value.replace(/[\s+]/g, '');
  }
}
