import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'imagen',
})
export class ImagenPipe implements PipeTransform {
  transform(imagen: string, tipo: 'usuarios' | 'ministerios'): string {
    if (!imagen) {
      return `${base_url}/uploads/usuarios/no-image.jpg`;
    } else if (imagen.includes('https')) {
      return imagen;
    } else if (imagen) {
      return `${base_url}/uploads/${tipo}/${imagen}`;
    } else {
      return `${base_url}/uploads/${imagen}/no-image.jpg`;
    }
  }
}
