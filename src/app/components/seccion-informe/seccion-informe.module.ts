import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeccionInformeComponent } from './seccion-informe.component';

@NgModule({
  imports: [CommonModule, SeccionInformeComponent],
  exports: [SeccionInformeComponent],
})
export class SeccionInformeModule {}
