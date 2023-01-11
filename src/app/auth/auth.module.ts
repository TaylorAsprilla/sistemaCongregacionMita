import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PasswordComponent } from './password/password.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginComponent, PasswordComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule],
})
export class AuthModule {}
