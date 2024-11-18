import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargandoInformacionComponent } from './cargando-informacion.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
    imports: [CommonModule, AppRoutingModule, CargandoInformacionComponent],
    exports: [CargandoInformacionComponent],
})
export class CargandoInformacionModule {}
