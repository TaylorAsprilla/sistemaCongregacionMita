import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app.routes';
import { CrearActividadComponent } from './crear-actividad/crear-actividad.component';
import { CrearStatusComponent } from './crear-status/crear-status.component';
import { InformeActividadesComponent } from './informe-actividades/informe-actividades.component';
import { InformeContablesComponent } from './informe-contables/informe-contables.component';
import { InformeLogrosComponent } from './informe-logros/informe-logros.component';
import { InformeMetasComponent } from './informe-metas/informe-metas.component';
import { InformeVisitasComponent } from './informe-visitas/informe-visitas.component';
import { InformeComponent } from './informe/informe.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearCampoComponent } from '../administracion/campo/crear-campo/crear-campo.component';
import { VerInformeComponent } from './ver-informe/ver-informe.component';
import { KeysPipe } from './ver-informe/keys.pipe';
import { SeccionInformeModule } from 'src/app/components/seccion-informe/seccion-informe.module';
import { InformeSituacionVisitaComponent } from './informe-situacion-visita/informe-situacion-visita.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SeccionInformeModule,
    CrearActividadComponent,
    CrearStatusComponent,
    InformeActividadesComponent,
    InformeContablesComponent,
    InformeLogrosComponent,
    InformeMetasComponent,
    InformeVisitasComponent,
    InformeSituacionVisitaComponent,
    InformeComponent,
    CrearCampoComponent,
    VerInformeComponent,
    KeysPipe,
  ],
  exports: [
    CrearActividadComponent,
    CrearStatusComponent,
    InformeActividadesComponent,
    InformeContablesComponent,
    InformeLogrosComponent,
    InformeMetasComponent,
    InformeVisitasComponent,
    KeysPipe,
  ],
})
export class InformeModule {}
