import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CensoAyudanteComponent } from './censo-ayudante/censo-ayudante.component';
import { VerCensoModule } from 'src/app/components/ver-censo/ver-censo.module';
import { CargandoInformacionModule } from 'src/app/components/cargando-informacion/cargando-informacion.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        PipesModule,
        VerCensoModule,
        CargandoInformacionModule,
        CensoAyudanteComponent,
    ],
})
export class AyudantesModule {}
