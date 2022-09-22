import { PipeTransform, Pipe } from '@angular/core';

const excluded = [
  // 'createdAt',
  'updatedAt',
  'informe_id',
  'id',
  'estado',
  'tipoStatus_id',
  'tipoActividad_id',
  'idSeccion',
];

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value): any {
    let keys = [];
    for (let key in value) {
      if (!excluded.includes(key)) {
        keys.push(key);
      }
    }
    return keys;
  }
}
