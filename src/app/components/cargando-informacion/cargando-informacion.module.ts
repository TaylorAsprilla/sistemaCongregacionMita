import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargandoInformacionComponent } from './cargando-informacion.component';

@NgModule({
  imports: [CommonModule, CargandoInformacionComponent],
  exports: [CargandoInformacionComponent],
})
export class CargandoInformacionModule {}
