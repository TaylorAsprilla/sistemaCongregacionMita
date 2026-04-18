import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDate',
  standalone: true,
})
export class LocalDatePipe implements PipeTransform {
  transform(value: Date | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '';

    let date: Date;

    if (typeof value === 'string') {
      // Parsear como fecha local para evitar desfase por zona horaria (UTC)
      // Formato esperado: YYYY-MM-DD o ISO 8601
      const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
      if (isoDateOnly) {
        const [year, month, day] = value.split('-').map(Number);
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(value);
      }
    } else {
      date = value;
    }

    if (isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat(navigator.language, { dateStyle: 'short' }).format(date);
  }
}
