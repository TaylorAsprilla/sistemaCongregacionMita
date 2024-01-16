import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'whatsapp',
})
export class WhatsappPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    return value.replace(/[\s\-\+]+/g, '');
  }
}
