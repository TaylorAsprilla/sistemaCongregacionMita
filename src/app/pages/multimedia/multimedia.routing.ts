import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CongregacionResolver } from 'src/app/resolvers/congregacion/congregacion.resolver';
import { NacionalidadResolver } from 'src/app/resolvers/nacionalidad/nacionalidad.resolver';
import { PaisResolver } from 'src/app/resolvers/pais/pais.resolver';
import { RazonSolicitudResolver } from 'src/app/resolvers/razon-solicitud/razon-solicitud.resolver';
import { Rutas } from 'src/app/routes/menu-items';
import { CrearSolicitudMultimediaComponent } from './crear-solicitud-multimedia/crear-solicitud-multimedia.component';
import { ServiciosYVigiliasComponent } from './servicios-y-vigilias/servicios-y-vigilias.component';
import { ValidarEmailComponent } from './validar-email/validar-email.component';

const routes: Routes = [
  {
    path: 'solicitud',
    component: CrearSolicitudMultimediaComponent,
    resolve: {
      nacionalidad: NacionalidadResolver,
      congregacion: CongregacionResolver,
      pais: PaisResolver,
      razonSolicitud: RazonSolicitudResolver,
    },
  },
  {
    path: 'validaremail/:id',
    component: ValidarEmailComponent,
  },
  {
    path: Rutas.SERVICIOS_Y_VIGILIAS,
    component: ServiciosYVigiliasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudRoutingModule {}
