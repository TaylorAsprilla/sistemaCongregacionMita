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
import { InformeSituacionVisitaComponent } from './situacion-visita/informe-situacion-visita.component';
import { InformeComponent } from './informe/informe.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearCongregacionComponent } from './crear-congregacion/crear-congregacion.component';
import { CrearPaisComponent } from './crear-pais/crear-pais.component';
import { CrearCampoComponent } from './crear-campo/crear-campo.component';

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
    CrearCongregacionComponent,
    CrearPaisComponent,
    CrearCampoComponent,
  ],
  imports: [CommonModule, AppRoutingModule, FormsModule, ReactiveFormsModule, ComponentsModule],
  exports: [
    CrearActividadComponent,
    CrearStatusComponent,
    InformeActividadesComponent,
    InformeContablesComponent,
    InformeLogrosComponent,
    InformeMetasComponent,
    InformeVisitasComponent,
    InformeSituacionVisitaComponent,
  ],
})
export class InformesModule {}
