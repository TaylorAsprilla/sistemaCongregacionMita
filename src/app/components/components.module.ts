import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { SeccionInformeComponent } from './seccion-informe/seccion-informe.component';

@NgModule({
  declarations: [SeccionInformeComponent],
  imports: [CommonModule, AppRoutingModule],
  exports: [SeccionInformeComponent],
})
export class ComponentsModule {}
