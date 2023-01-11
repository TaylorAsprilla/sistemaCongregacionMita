import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RUTAS } from 'src/app/routes/menu-items';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {
  passwordForm: FormGroup;

  get Rutas() {
    return RUTAS;
  }

  constructor(private router: Router, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      login: [localStorage.getItem('login') || '', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  cambiarPassword() {}
}
