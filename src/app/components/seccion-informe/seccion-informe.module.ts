import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeccionInformeComponent } from './seccion-informe.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [SeccionInformeComponent],
  imports: [CommonModule, AppRoutingModule],
  exports: [SeccionInformeComponent],
})
export class SeccionInformeModule {}
