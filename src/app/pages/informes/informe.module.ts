import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CrearActividadComponent } from './crear-actividad/crear-actividad.component';
import { CrearStatusComponent } from './crear-status/crear-status.component';
import { InformeActividadesComponent } from './informe-actividades/informe-actividades.component';
import { InformeContablesComponent } from './informe-contables/informe-contables.component';
import { InformeLogrosComponent } from './informe-logros/informe-logros.component';
import { InformeMetasComponent } from './informe-metas/informe-metas.component';
import { InformeVisitasComponent } from './informe-visitas/informe-visitas.component';
import { InformeSituacionVisitaComponent } from './informe-situacion-visita/informe-situacion-visita.component';
import { InformeComponent } from './informe/informe.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InformeAsuntoPendienteComponent } from './informe-asunto-pendiente/informe-asunto-pendiente.component';
import { CrearCampoComponent } from '../administracion/campo/crear-campo/crear-campo.component';
import { VerInformeComponent } from './ver-informe/ver-informe.component';
import { KeysPipe } from './ver-informe/keys.pipe';
import { SeccionInformeModule } from 'src/app/components/seccion-informe/seccion-informe.module';

@NgModule({
  declarations: [
    CrearActividadComponent,
    CrearStatusComponent,
    InformeActividadesComponent,
    InformeContablesComponent,
    InformeLogrosComponent,
    InformeMetasComponent,
    InformeVisitasComponent,
    InformeSituacionVisitaComponent,
    InformeComponent,
    InformeAsuntoPendienteComponent,
    CrearCampoComponent,
    VerInformeComponent,
    KeysPipe,
  ],
  imports: [CommonModule, AppRoutingModule, FormsModule, ReactiveFormsModule, SeccionInformeModule],
  exports: [
    CrearActividadComponent,
    CrearStatusComponent,
    InformeActividadesComponent,
    InformeContablesComponent,
    InformeLogrosComponent,
    InformeMetasComponent,
    InformeVisitasComponent,
    InformeSituacionVisitaComponent,
    KeysPipe,
  ],
})
export class InformeModule {}
