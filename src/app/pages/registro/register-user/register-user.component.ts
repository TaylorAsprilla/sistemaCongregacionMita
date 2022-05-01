import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent implements OnInit, OnDestroy {
  public usuarioForm: FormGroup;

  public usuarios: UsuarioModel[] = [];

  // Subscription
  public usuarioSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private activateRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.usuarioForm = this.formBuilder.group({
      primerNombre: ['', [Validators.required, Validators.minLength(3)]],
      segundoNombre: ['', [Validators.minLength(3)]],
      primerApellido: ['', [Validators.required, Validators.minLength(3)]],
      segundoApellido: ['', [Validators.minLength(3)]],
      numeroDocumento: ['', [Validators.minLength(3)]],
      nacionalidad: ['', [Validators.minLength(3)]],
      fechaNacimiento: ['', []],
      email: ['', [Validators.email]],
      numeroCelular: ['', [Validators.minLength(3)]],
      foto: ['', []],
      genero_id: ['', [Validators.required]],
      tipoDocumento_id: ['', [Validators.required]],
      pais_id: ['', [Validators.required]],
      login: ['', []],
      password: ['', []],
    });

    this.usuarioSubscription = this.usuarioService.listarTodosLosUsuarios().subscribe(({ totalUsuarios, usuarios }) => {
      this.usuarios = usuarios;
    });
  }

  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
  }

  guardarUsuario() {
    const usuarioNuevo = this.usuarioForm.value;
    this.usuarioService.crearUsuario(usuarioNuevo).subscribe((usuarioCreado: any) => {
      Swal.fire('Usuario creado', 'correctamente`', 'success');
      this.router.navigateByUrl(`/sistema/usuario/${usuarioCreado}`);
    });
  }

  subirImagen() {}
}
