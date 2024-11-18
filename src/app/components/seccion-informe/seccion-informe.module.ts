import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeccionInformeComponent } from './seccion-informe.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
    imports: [CommonModule, AppRoutingModule, SeccionInformeComponent],
    exports: [SeccionInformeComponent],
})
export class SeccionInformeModule {}
