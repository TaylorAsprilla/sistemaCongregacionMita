import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { SeccionInformeComponent } from './seccion-informe/seccion-informe.component';
import { CargandoInformacionComponent } from './cargando-informacion/cargando-informacion.component';

@NgModule({
  declarations: [SeccionInformeComponent, CargandoInformacionComponent],
  imports: [CommonModule, AppRoutingModule],
  exports: [SeccionInformeComponent, CargandoInformacionComponent],
})
export class ComponentsModule {}
