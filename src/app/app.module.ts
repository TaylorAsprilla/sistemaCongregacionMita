import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
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
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './pages/registro/register/register.component';
import { RegisterCongComponent } from './pages/registro/register-cong/register-cong.component';
import { RegisterUserComponent } from './pages/registro/register-user/register-user.component';
import { RegisterCampoComponent } from './pages/registro/register-campo/register-campo.component';
import { RegisterMinisterioComponent } from './pages/registro/register-ministerio/register-ministerio.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
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
    HomeComponent,
    RegisterUserComponent,
    RegisterComponent,
    RegisterCongComponent,
    RegisterCampoComponent,
    RegisterMinisterioComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
