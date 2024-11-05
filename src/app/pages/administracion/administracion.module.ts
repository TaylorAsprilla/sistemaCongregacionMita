import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamposComponent } from './campo/campos/campos.component';
import { CongregacionesComponent } from './congregacion/congregaciones/congregaciones.component';
import { MinisteriosComponent } from './ministerios/ministerios/ministerios.component';
import { CrearCongregacionComponent } from './congregacion/crear-congregacion/crear-congregacion.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearPaisComponent } from './pais/crear-pais/crear-pais.component';
import { PaisesComponent } from './pais/paises/paises.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CrearMinisterioComponent } from './ministerios/crear-ministerio/crear-ministerio.component';
import { CargandoInformacionModule } from 'src/app/components/cargando-informacion/cargando-informacion.module';
import { CrearTipoDocumentoComponent } from './tipo-de-documento/crear-tipo-documento/crear-tipo-documento.component';
import { TiposDeDocumentosComponent } from './tipo-de-documento/tipos-de-documentos/tipos-de-documentos.component';
import { InformacionUsuarioModule } from 'src/app/components/informacion-usuario/informacion-usuario.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AsignarPermisosComponent } from './asignar-permisos/asignar-permisos.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { FiltrosModule } from 'src/app/components/filtros/filtros.module';
import { BuscarUsuarioModule } from 'src/app/components/buscar-usuario/buscar-usuario.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    CamposComponent,
    CongregacionesComponent,
    CrearPaisComponent,
    MinisteriosComponent,
    CrearCongregacionComponent,
    PaisesComponent,
    CrearMinisterioComponent,
    CrearTipoDocumentoComponent,
    TiposDeDocumentosComponent,
    AsignarPermisosComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    CargandoInformacionModule,
    ReactiveFormsModule,
    BrowserModule,
    NgxIntlTelInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    InformacionUsuarioModule,
    UsuarioModule,
    FiltrosModule,
    PipesModule,
    BuscarUsuarioModule,
  ],
  exports: [
    CamposComponent,
    CongregacionesComponent,
    MinisteriosComponent,
    CrearCongregacionComponent,
    CrearPaisComponent,
  ],
})
export class AdministracionModule {}
