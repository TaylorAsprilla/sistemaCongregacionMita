import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamposComponent } from 'src/app/pages/administracion/campos/campos.component';
import { CongregacionesComponent } from 'src/app/pages/administracion/congregaciones/congregaciones.component';
import { MinisteriosComponent } from 'src/app/pages/administracion/ministerios/ministerios.component';
import { UsuariosComponent } from 'src/app/pages/administracion/usuarios/usuarios.component';
import { CrearActividadComponent } from 'src/app/pages/informes/crear-actividad/crear-actividad.component';

import { CrearCampoComponent } from 'src/app/pages/informes/crear-campo/crear-campo.component';
import { CrearCongregacionComponent } from 'src/app/pages/informes/crear-congregacion/crear-congregacion.component';
import { CrearPaisComponent } from 'src/app/pages/informes/crear-pais/crear-pais.component';

import { CrearStatusComponent } from 'src/app/pages/informes/crear-status/crear-status.component';
import { InformeActividadesComponent } from 'src/app/pages/informes/informe-actividades/informe-actividades.component';
import { InformeContablesComponent } from 'src/app/pages/informes/informe-contables/informe-contables.component';
import { InformeLogrosComponent } from 'src/app/pages/informes/informe-logros/informe-logros.component';
import { InformeMetasComponent } from 'src/app/pages/informes/informe-metas/informe-metas.component';
import { InformeVisitasComponent } from 'src/app/pages/informes/informe-visitas/informe-visitas.component';
import { InformeComponent } from 'src/app/pages/informes/informe/informe.component';
import { InformeSituacionVisitaComponent } from 'src/app/pages/informes/situacion-visita/informe-situacion-visita.component';
import { VerInformeComponent } from 'src/app/pages/informes/ver-informe/ver-informe.component';
import { InicioComponent } from 'src/app/pages/inicio/inicio.component';
import { PerfilComponent } from 'src/app/pages/perfil/perfil.component';
import { RegisterCampoComponent } from 'src/app/pages/registro/register-campo/register-campo.component';
import { RegisterCongregacionComponent } from 'src/app/pages/registro/register-congregacion/register-congregacion.component';
import { RegisterMinisterioComponent } from 'src/app/pages/registro/register-ministerio/register-ministerio.component';
import { RegistrarUsuarioComponent } from 'src/app/pages/registro/registrar-usuario/registrar-usuario.component';
import { Rutas } from '../menu-items';

const childRoutes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
    data: { titulo: 'Censo' },
  },

  // Administración
  {
    path: Rutas.USUARIOS,
    component: UsuariosComponent,
    data: { titulo: 'Usuarios Registrados' },
  },
  {
    path: 'ministerios',
    component: MinisteriosComponent,
    data: { titulo: 'Ministerios' },
  },
  {
    path: Rutas.CONGREGACION,
    component: CongregacionesComponent,
    data: { titulo: 'Congregaciones' },
  },
  {
    path: Rutas.CAMPO,
    component: CamposComponent,
    data: { titulo: 'Campos' },
  },

  {
    path: 'register/user',
    redirectTo: '/register/user',
    pathMatch: 'full',
  },
  {
    path: Rutas.REGISTRAR_USUARIO,
    component: RegistrarUsuarioComponent,
  },
  {
    path: Rutas.CONGREGACION,
    component: RegisterCongregacionComponent,
  },
  {
    path: Rutas.CAMPO,
    component: RegisterCampoComponent,
  },
  {
    path: 'ministerio',
    component: RegisterMinisterioComponent,
  },
  // Perfil
  {
    path: 'perfil',
    component: PerfilComponent,
  },
  // Informes
  {
    path: Rutas.CREAR_ACTIVIDAD,
    component: CrearActividadComponent,
  },
  {
    path: Rutas.CREAR_CAMPO,
    component: CrearCampoComponent,
  },
  {
    path: Rutas.CREAR_CONGREGACION,
    component: CrearCongregacionComponent,
  },
  {
    path: Rutas.CREAR_PAIS,
    component: CrearPaisComponent,
  },
  {
    path: Rutas.CREAR_ESTATUS,
    component: CrearStatusComponent,
  },
  {
    path: Rutas.INFORME_ACTIVIDADES,
    component: InformeActividadesComponent,
  },
  {
    path: Rutas.INFORME_CONTABLE,
    component: InformeContablesComponent,
  },
  {
    path: Rutas.INFORME_LOGROS,
    component: InformeLogrosComponent,
  },
  {
    path: Rutas.METAS,
    component: InformeMetasComponent,
  },
  {
    path: Rutas.INFORME_VISITAS,
    component: InformeVisitasComponent,
  },
  {
    path: Rutas.SITUACION_VISITA,
    component: InformeSituacionVisitaComponent,
  },
  // informes pagina principal
  {
    path: Rutas.INFORME,
    component: InformeComponent,
  },
  {
    path: Rutas.VER_INFORME,
    component: VerInformeComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
