import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BredcrumbsComponent } from './shared/bredcrumbs/bredcrumbs.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UsuariosComponent } from './pages/administracion/usuarios/usuarios.component';
import { MinisterioComponent } from './pages/administracion/ministerio/ministerio.component';
import { CongregacionesComponent } from './pages/administracion/congregaciones/congregaciones.component';
import { CamposComponent } from './pages/administracion/campos/campos.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NopagefoundComponent,
    DashboardComponent,
    BredcrumbsComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    UsuariosComponent,
    MinisterioComponent,
    CongregacionesComponent,
    CamposComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
