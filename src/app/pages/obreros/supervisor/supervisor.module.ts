import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CargandoInformacionModule } from 'src/app/components/cargando-informacion/cargando-informacion.module';
import { UsuariosSupervisorComponent } from './usuarios-supervisor/usuarios-supervisor.component';

@NgModule({
  declarations: [UsuariosSupervisorComponent],
  imports: [CommonModule, AppRoutingModule, FormsModule, CargandoInformacionModule, ReactiveFormsModule, BrowserModule],
  exports: [UsuariosSupervisorComponent],
})
export class SupervisorModule {}
