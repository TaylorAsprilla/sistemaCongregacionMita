import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth.routing';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { PagesRoutingModule } from './pages/pages.routing';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/sistema',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NopagefoundComponent,
  },
  // {
  //   path: '',
  //   redirectTo: '/dashboard',
  //   pathMatch: 'full',
  //   children: [
  //     {
  //       path: 'register',
  //       component: RegisterComponent,
  //       children: [
  //         {
  //           path: '',
  //           redirectTo: '/register/user',
  //           pathMatch: 'full',
  //         },
  //         {
  //           path: 'user',
  //           component: RegisterUserComponent,
  //         },
  //         {
  //           path: 'congregacion',
  //           component: RegisterCongregacionComponent,
  //         },
  //         {
  //           path: 'campo',
  //           component: RegisterCampoComponent,
  //         },
  //         {
  //           path: 'ministerio',
  //           component: RegisterMinisterioComponent,
  //         },
  //       ],
  //     },

  //   ],
  // },
  // {
  //   path: 'login',
  //   component: LoginComponent,
  // },
  // {
  //   path: '',
  //   redirectTo: '/dashboard',
  //   pathMatch: 'full',
  // },
  // {
  //   path: '**',
  //   component: NopagefoundComponent,
  // },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes), PagesRoutingModule, AuthRoutingModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
