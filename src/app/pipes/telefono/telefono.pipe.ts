import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefono',
})
export class TelefonoPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    return value.replace(/[-\s]/g, '');
  }
}
