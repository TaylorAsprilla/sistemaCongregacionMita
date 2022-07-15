import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  isEdit: boolean = false;
  public perfilForm: FormGroup;
  public usuario: UsuarioModel;

  constructor(private usuarioService: UsuarioService, private formBuilder: FormBuilder) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.formBuilder.group({
      primerNombre: [this.usuario.primerNombre, [Validators.required, Validators.minLength(3)]],
      segundoNombre: [this.usuario.segundoNombre, [Validators.minLength(3)]],
      primerApellido: [this.usuario.primerApellido, [Validators.required, Validators.minLength(3)]],
      segundoApellido: [this.usuario.segundoApellido, [Validators.minLength(3)]],
      numeroDocumento: [this.usuario.numeroDocumento, [Validators.required]],
      nacionalidad: [this.usuario.nacionalidad, [Validators.required, Validators.minLength(3)]],
      email: [this.usuario.email, [Validators.required, Validators.email]],
      numeroCelular: [this.usuario.numeroCelular, [Validators.minLength(3)]],
      fechaNacimiento: [this.usuario.fechaNacimiento, [Validators.required]],
      login: [this.usuario.login, []],
      password: [this.usuario.password, []],
      foto: [this.usuario.fotoUrl, []],
      genero_id: [this.usuario.genero_id, [Validators.required]],
      tipoDocumento_id: [this.usuario.tipoDocumento_id, [Validators.required]],
      pais_id: [this.usuario.pais_id, [Validators.required]],
    });
  }

  toggleEdit() {
    this.isEdit = !this.isEdit;
    console.log(this.isEdit);
  }

  submit() {
    this.toggleEdit();
  }
}
