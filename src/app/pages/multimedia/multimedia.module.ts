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
import { ValidarEmailComponent } from './validar-email/validar-email.component';
import { ServiciosYVigiliasComponent } from './servicios-y-vigilias/servicios-y-vigilias.component';
import { ConfigurarServiciosYVigiliasComponent } from './configurar-servicios-y-vigilias/configurar-servicios-y-vigilias.component';
import { ServiciosComponent } from './biblioteca-multimedia/servicios/servicios.component';
import { VigiliasComponent } from './biblioteca-multimedia/vigilias/vigilias.component';
import { BibliotecaMultimediaModule } from 'src/app/components/biblioteca-multimedia/biblioteca-multimedia.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

const lang = 'en-US';

@NgModule({
  declarations: [
    SolicitudMultimediaComponent,
    CrearSolicitudMultimediaComponent,
    FormularioFamiliaresComponent,
    ValidarEmailComponent,
    ServiciosYVigiliasComponent,
    ConfigurarServiciosYVigiliasComponent,
    ServiciosComponent,
    VigiliasComponent,
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
    NgxMaterialTimepickerModule,
    BibliotecaMultimediaModule,
    PipesModule,
  ],
  exports: [[SolicitudMultimediaComponent, CrearSolicitudMultimediaComponent, ValidarEmailComponent]],
})
export class MultimediaModule {}
