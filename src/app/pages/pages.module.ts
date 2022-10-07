import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdministracionModule } from './administracion/administracion.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { InicioComponent } from './inicio/inicio.component';
import { PerfilModule } from './perfil/perfil.module';
import { InformeModule } from './informes/informe.module';
import { PipesModule } from '../pipes/pipes.module';
import { NopagefoundModule } from './nopagefound/nopagefound.module';
import { CrearSolicitudMultimediaComponent } from './multimedia/crear-solicitud-multimedia/crear-solicitud-multimedia.component';
import { CargandoInformacionModule } from '../components/cargando-informacion/cargando-informacion.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SolicitudMultimediaComponent } from './multimedia/solicitud-multimedia/solicitud-multimedia.component';

@NgModule({
  declarations: [PagesComponent, InicioComponent, SolicitudMultimediaComponent, CrearSolicitudMultimediaComponent],
  exports: [PagesComponent, InicioComponent],
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
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxIntlTelInputModule,
  ],
})
export class PagesModule {}
