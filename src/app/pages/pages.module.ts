import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdministracionModule } from './administracion/administracion.module';
import { RegisterModule } from './registro/register.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { InicioComponent } from './inicio/inicio.component';
import { PerfilComponent } from './perfil/perfil.component';
import { EditPerfilComponent } from './perfil/edit-perfil/edit-perfil.component';
import { InfoPerfilComponent } from './perfil/info-perfil/info-perfil.component';

@NgModule({
  declarations: [NopagefoundComponent, DashboardComponent, PagesComponent, InicioComponent, PerfilComponent, EditPerfilComponent, InfoPerfilComponent],
  exports: [NopagefoundComponent, DashboardComponent, PagesComponent, InicioComponent, InfoPerfilComponent, EditPerfilComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    AdministracionModule,
    RegisterModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule
  ],
})
export class PagesModule {}
