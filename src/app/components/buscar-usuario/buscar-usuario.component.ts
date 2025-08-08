import Swal from 'sweetalert2';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
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
  private formBuilder = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  @Input() crearAccesoBoton: boolean = false;
  @Input() ocultarBusqueda: boolean = false;

  @Output() usuarioEncontrado: EventEmitter<UsuarioModel> = new EventEmitter<UsuarioModel>();
  @Output() actualizarUsuario: EventEmitter<UsuarioModel> = new EventEmitter<UsuarioModel>();
  @Output() crearAcceso: EventEmitter<UsuarioModel> = new EventEmitter<UsuarioModel>();
  @Output() scrollToSection: EventEmitter<any> = new EventEmitter<any>();

  numeroMitaForm: FormGroup;
  usuario: UsuarioModel;
  asignarPermisos: boolean = false;

  usuarioSubscription: Subscription;

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

          this.usuarioEncontrado.emit(this.usuario);
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

  emitirActualizarUsuario() {
    this.actualizarUsuario.emit(this.usuario);
  }

  emitirCrearAcceso() {
    this.crearAcceso.emit(this.usuario);
  }

  emitirScrollToSection() {
    this.scrollToSection.emit();
  }
}
