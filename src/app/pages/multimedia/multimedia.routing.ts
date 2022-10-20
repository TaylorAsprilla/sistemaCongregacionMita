import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CongregacionResolver } from 'src/app/resolvers/congregacion/congregacion.resolver';
import { NacionalidadResolver } from 'src/app/resolvers/nacionalidad/nacionalidad.resolver';
import { PaisResolver } from 'src/app/resolvers/pais/pais.resolver';
import { ParentescoResolver } from 'src/app/resolvers/parentesco/parentesco.resolver';
import { RazonSolicitudResolver } from 'src/app/resolvers/razon-solicitud/razon-solicitud.resolver';
import { CrearSolicitudMultimediaComponent } from './crear-solicitud-multimedia/crear-solicitud-multimedia.component';
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
      parentesco: ParentescoResolver,
    },
  },
  {
    path: 'validaremail/:id',
    component: ValidarEmailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudRoutingModule {}
