import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginForm } from 'src/app/interfaces/login-form.interface';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  usuariosSubscription: Subscription;

  loginForm = this.formBuilder.group({
    login: [localStorage.getItem('login') || '', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    remember: [false],
  });

  constructor(private router: Router, private formBuilder: FormBuilder, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuariosSubscription = this.usuarioService.listarUsuarios().subscribe(
      (res) => console.log(res),
      (err) => console.error(err)
    );
  }

  ngOnDestroy(): void {
    this.usuariosSubscription?.unsubscribe();
  }

  login() {
    this.usuarioService.login(this.loginForm.value).subscribe(
      (loginUsuario: LoginForm) => {
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('login', this.loginForm.get('login').value);
        } else {
          localStorage.removeItem('login');
        }
        Swal.fire({
          icon: 'success',
          title: 'Bienvenido ' + this.loginForm.get('login').value,
          showConfirmButton: false,
          timer: 1500,
        });

        // Navegar al Dashboard
        this.router.navigateByUrl('/');
      },
      (err) => {
        Swal.fire({ icon: 'error', html: 'Usuario y/o contraseña inválida' });
      }
    );
  }
}
