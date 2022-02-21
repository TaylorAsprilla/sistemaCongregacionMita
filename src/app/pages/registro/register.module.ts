import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { RegisterCampoComponent } from './register-campo/register-campo.component';
import { RegisterCongregacionComponent } from './register-congregacion/register-congregacion.component';
import { RegisterMinisterioComponent } from './register-ministerio/register-ministerio.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [
    RegisterComponent,
    RegisterCampoComponent,
    RegisterCongregacionComponent,
    RegisterMinisterioComponent,
    RegisterUserComponent,
  ],
  imports: [CommonModule, AppRoutingModule],
})
export class RegisterModule {}
