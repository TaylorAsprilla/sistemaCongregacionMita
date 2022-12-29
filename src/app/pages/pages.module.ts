import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdministracionModule } from './administracion/administracion.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfilModule } from './perfil/perfil.module';
import { InformeModule } from './informes/informe.module';
import { PipesModule } from '../pipes/pipes.module';
import { NopagefoundModule } from './nopagefound/nopagefound.module';
import { CargandoInformacionModule } from '../components/cargando-informacion/cargando-informacion.module';
import { MultimediaModule } from './multimedia/multimedia.module';
import { InicioModule } from './inicio/inicio.module';
import { SupervisorModule } from './supervisor/supervisor.module';

@NgModule({
  declarations: [PagesComponent],
  exports: [PagesComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    AdministracionModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    PerfilModule,
    InformeModule,
    PipesModule,
    NopagefoundModule,
    CargandoInformacionModule,
    MultimediaModule,
    InicioModule,
    SupervisorModule,
  ],
})
export class PagesModule {}
