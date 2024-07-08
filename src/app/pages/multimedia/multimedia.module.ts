import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudMultimediaComponent } from './solicitudes-multimedia/solicitud-multimedia/solicitud-multimedia.component';
import { CrearSolicitudMultimediaComponent } from './solicitudes-multimedia/crear-solicitud-multimedia/crear-solicitud-multimedia.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CargandoInformacionModule } from 'src/app/components/cargando-informacion/cargando-informacion.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidarEmailComponent } from './solicitudes-multimedia/validar-email/validar-email.component';
import { ServiciosComponent } from './biblioteca-multimedia/servicios/servicios.component';
import { VigiliasComponent } from './biblioteca-multimedia/vigilias/vigilias.component';
import { BibliotecaMultimediaModule } from 'src/app/components/biblioteca-multimedia/biblioteca-multimedia.module';
import { ConfigurarEventosComponent } from './eventos-multimedia/configurar-eventos/configurar-eventos.component';
import { EventosComponent } from './eventos-multimedia/eventos/eventos.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { BuscarUsuarioModule } from 'src/app/components/buscar-usuario/buscar-usuario.module';
import { ServiciosEnVivoModule } from 'src/app/components/servicios-en-vivo/servicios-en-vivo.module';
import { EventosEnVivoComponent } from './eventos-multimedia/eventos-en-vivo/eventos-en-vivo.component';
import { NgxPaginationModule } from 'ngx-pagination';

const lang = 'en-US';

@NgModule({
  declarations: [
    SolicitudMultimediaComponent,
    CrearSolicitudMultimediaComponent,
    ValidarEmailComponent,
    ConfigurarEventosComponent,
    ServiciosComponent,
    VigiliasComponent,
    EventosComponent,
    EventosEnVivoComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxIntlTelInputModule,
    CargandoInformacionModule,
    BibliotecaMultimediaModule,
    PipesModule,
    BuscarUsuarioModule,
    ServiciosEnVivoModule,
    NgxPaginationModule,
  ],
  exports: [SolicitudMultimediaComponent, CrearSolicitudMultimediaComponent, ValidarEmailComponent],
  providers: [{ provide: LOCALE_ID, useValue: lang }],
})
export class MultimediaModule {}
