import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CensoObreroComponent } from './censo-obrero/censo-obrero.component';
import { AppRoutingModule } from 'src/app/app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CargandoInformacionModule } from 'src/app/components/cargando-informacion/cargando-informacion.module';
import { CensoSupervisorComponent } from './censo-supervisor/censo-supervisor.component';

import { VerCensoModule } from 'src/app/components/ver-censo/ver-censo.module';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    PipesModule,
    CargandoInformacionModule,
    VerCensoModule,
    CensoObreroComponent,
    CensoSupervisorComponent,
  ],
})
export class ObrerosModule {}
