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
import { CrearActividadComponent } from './informes/crear-actividad/crear-actividad.component';
import { InformeActividadesComponent } from './informes/informe-actividades/informe-actividades.component';
import { InformeContablesComponent } from './informes/informe-contables/informe-contables.component';
import { InformeLogrosComponent } from './informes/informe-logros/informe-logros.component';
import { InformeMetasComponent } from './informes/informe-metas/informe-metas.component';
import { CrearStatusComponent } from './informes/crear-status/crear-status.component';
import { InformeVisitasComponent } from './informes/informe-visitas/informe-visitas.component';
import { SituacionVisitaComponent } from './informes/situacion-visita/situacion-visita.component';
import { InicioComponent } from './inicio/inicio.component';
import { PerfilModule } from './perfil/perfil.module';

@NgModule({
  declarations: [
    NopagefoundComponent,
    DashboardComponent,
    PagesComponent,
    InicioComponent,
    CrearActividadComponent,
    InformeActividadesComponent,
    InformeContablesComponent,
    InformeLogrosComponent,
    InformeMetasComponent,
    CrearStatusComponent,
    InformeVisitasComponent,
    SituacionVisitaComponent,
  ],
  exports: [NopagefoundComponent, DashboardComponent, PagesComponent, InicioComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    AdministracionModule,
    RegisterModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    PerfilModule,
  ],
})
export class PagesModule {}
