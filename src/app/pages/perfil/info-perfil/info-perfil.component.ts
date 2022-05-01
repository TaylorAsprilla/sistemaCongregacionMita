import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-info-perfil',
  templateUrl: './info-perfil.component.html',
  styleUrls: ['./info-perfil.component.css'],
})
export class InfoPerfilComponent implements OnInit {
  @Input() usuario: UsuarioModel;
  public perfilForm: FormGroup;
  @Output() toggleEdit: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {}

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

  submit() {
    this.toggleEdit.emit();
  }
}
