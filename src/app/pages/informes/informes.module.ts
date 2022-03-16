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
import { SituacionVisitaComponent } from './situacion-visita/situacion-visita.component';
import { InformeComponent } from './informe/informe.component';
import { SeccionComponent } from './seccion/seccion.component';

@NgModule({
  declarations: [
    CrearActividadComponent,
    CrearStatusComponent,
    InformeActividadesComponent,
    InformeContablesComponent,
    InformeLogrosComponent,
    InformeMetasComponent,
    InformeVisitasComponent,
    SituacionVisitaComponent,
    InformeComponent,
    SeccionComponent,
  ],
  imports: [CommonModule, AppRoutingModule],
  exports: [
    CrearActividadComponent,
    CrearStatusComponent,
    InformeActividadesComponent,
    InformeContablesComponent,
    InformeLogrosComponent,
    InformeMetasComponent,
    InformeVisitasComponent,
    SituacionVisitaComponent,
  ],
})
export class InformesModule {}
