import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { AdministracionModule } from './administracion/administracion.module';
import { RegisterModule } from './registro/register.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { InicioComponent } from './inicio/inicio.component';
import { PerfilModule } from './perfil/perfil.module';
import { InformeModule } from './informes/informe.module';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [NopagefoundComponent, PagesComponent, InicioComponent],
  exports: [NopagefoundComponent, PagesComponent, InicioComponent],
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
    InformeModule,
    PipesModule,
  ],
})
export class PagesModule {}
