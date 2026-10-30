import { Pipe, PipeTransform } from '@angular/core';
import { formatearNumeroMita } from '../../core/utils/numero-mita';

@Pipe({
  name: 'numeroMita',
  standalone: true,
})
export class NumeroMitaPipe implements PipeTransform {
  transform(numero: number | null | undefined): string {
    return numero == null ? '' : formatearNumeroMita(numero);
  }
}
