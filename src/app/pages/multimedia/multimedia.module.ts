import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudMultimediaComponent } from './solicitud-multimedia/solicitud-multimedia.component';
import { CrearSolicitudMultimediaComponent } from './crear-solicitud-multimedia/crear-solicitud-multimedia.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CargandoInformacionModule } from 'src/app/components/cargando-informacion/cargando-informacion.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FormularioFamiliaresComponent } from './formulario-familiares/formulario-familiares.component';

const lang = 'en-US';

@NgModule({
  declarations: [SolicitudMultimediaComponent, CrearSolicitudMultimediaComponent, FormularioFamiliaresComponent],
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
    NgxMaterialTimepickerModule,
  ],
  exports: [[SolicitudMultimediaComponent, CrearSolicitudMultimediaComponent]],
})
export class MultimediaModule {}
