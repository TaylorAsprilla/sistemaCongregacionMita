import Swal from 'sweetalert2';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { CalcularEdadPipe } from '../../pipes/calcularEdad/calcular-edad.pipe';

@Component({
  selector: 'app-buscar-usuario',
  templateUrl: './buscar-usuario.component.html',
  styleUrls: ['./buscar-usuario.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CalcularEdadPipe],
})
export class BuscarUsuarioComponent implements OnInit, OnDestroy, OnChanges {
  @Input() crearAccesoBoton: boolean = false;
  @Input() ocultarBusqueda: boolean = false;

  @Output() onUsuarioEncontrado: EventEmitter<UsuarioModel> = new EventEmitter<UsuarioModel>();
  @Output() onActualizarUsuario: EventEmitter<UsuarioModel> = new EventEmitter<UsuarioModel>();
  @Output() onCrearAcceso: EventEmitter<UsuarioModel> = new EventEmitter<UsuarioModel>();
  @Output() onScrollToSection: EventEmitter<any> = new EventEmitter<any>();

  numeroMitaForm: FormGroup;
  usuario: UsuarioModel;
  asignarPermisos: boolean = false;

  usuarioSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.crearFormularioNumeroMita();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ocultarBusqueda'] && changes['ocultarBusqueda'].currentValue) {
      this.usuario = null;
      this.numeroMitaForm.reset();
    }
  }

  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
  }

  crearFormularioNumeroMita() {
    this.numeroMitaForm = this.formBuilder.group({
      numeroMita: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  buscarFeligres(id: string) {
    this.asignarPermisos = false;
    this.usuarioSubscription = this.usuarioService.getUsuario(Number(id)).subscribe({
      next: (respuesta: any) => {
        if (!!respuesta.usuario) {
          this.usuario = respuesta.usuario;

          Swal.fire({
            position: 'top-end',
            text: `${this.usuario.primerNombre} ${this.usuario.segundoNombre}
                ${this.usuario.primerApellido} ${this.usuario.segundoApellido},
                Número Mita ${this.usuario.id}`,
            timer: 1000,
            showConfirmButton: false,
          });

          this.onUsuarioEncontrado.emit(this.usuario);
        } else {
          Swal.fire({
            position: 'top-end',
            text: `${respuesta.msg}`,
            icon: 'error',
            timer: 1000,
            showConfirmButton: false,
          });
        }
      },
      error: (error) => {
        let errores = error.error.msg;

        Swal.fire({
          title: 'Error al encontrar el feligrés',
          icon: 'error',
          html: errores,
        });
      },
    });
  }

  actualizarUsuario() {
    this.onActualizarUsuario.emit(this.usuario);
  }

  crearAcceso() {
    this.onCrearAcceso.emit(this.usuario);
  }

  scrollToSection() {
    this.onScrollToSection.emit();
  }
}
