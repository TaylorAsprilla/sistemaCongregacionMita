import { Routes } from '@angular/router';
import { CongregacionResolver } from 'src/app/resolvers/congregacion/congregacion.resolver';
import { NacionalidadResolver } from 'src/app/resolvers/nacionalidad/nacionalidad.resolver';
import { PaisResolver } from 'src/app/resolvers/pais/pais.resolver';
import { RazonSolicitudResolver } from 'src/app/resolvers/razon-solicitud/razon-solicitud.resolver';
import { RUTAS } from 'src/app/routes/menu-items';
import { CrearSolicitudMultimediaComponent } from './solicitudes-multimedia/crear-solicitud-multimedia/crear-solicitud-multimedia.component';
import { ValidarEmailComponent } from './solicitudes-multimedia/validar-email/validar-email.component';

const routes: Routes = [
  {
    path: RUTAS.SOLICITUD,
    title: 'Solicitar acceso a servicios en línea',
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
    title: 'Verificar correo electrónico',
  },
];

export default routes;
