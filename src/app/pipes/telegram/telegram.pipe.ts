import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telegram',
})
export class TelegramPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    return value.replace(/[-\s]/g, '');
  }
}
