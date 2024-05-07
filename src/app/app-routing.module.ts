import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth.routing';
import { SolicitudRoutingModule } from './pages/multimedia/multimedia.routing';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { PagesRoutingModule } from './pages/pages.routing';
import { CONFIGURACION } from './core/enums/config.enum';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/sistema/inicio',
    pathMatch: 'full',
    title: CONFIGURACION.TITLE,
  },
  {
    path: '**',
    component: NopagefoundComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes), PagesRoutingModule, AuthRoutingModule, SolicitudRoutingModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
