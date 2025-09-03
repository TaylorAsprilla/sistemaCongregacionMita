import Swal from 'sweetalert2';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GRUPOGEMELOS } from 'src/app/core/enums/grupoGemelos.enum';
import { GemelosService } from 'src/app/services/gemelos/gemelos.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-grupo-gemelos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './grupo-gemelos.component.html',
  styleUrl: './grupo-gemelos.component.scss',
})
export default class GrupoGemelosComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private gemelosService = inject(GemelosService);
  private usuarioService = inject(UsuarioService);

  gemelosForm!: FormGroup;
  descripcionGenerada = '';
  tiposGrupo = Object.values(GRUPOGEMELOS);
  usuariosEncontrados: any[] = [];

  ngOnInit(): void {
    this.gemelosForm = this.formBuilder.group({
      tipo: ['', Validators.required],
      numerosMita: this.formBuilder.array([
        this.formBuilder.group({ numero: ['', Validators.required] }),
        this.formBuilder.group({ numero: ['', Validators.required] }),
      ]),
      fechaNacimientoComun: ['', Validators.required],
    });
  }

  get numerosMita(): FormArray {
    return this.gemelosForm.get('numerosMita') as FormArray;
  }

  get tipo() {
    return this.gemelosForm.get('tipo')!;
  }

  get fechaNacimientoComun() {
    return this.gemelosForm.get('fechaNacimientoComun')!;
  }

  agregarCampo() {
    this.numerosMita.push(this.formBuilder.group({ numero: ['', Validators.required] }));
  }

  eliminarCampo(index: number) {
    this.numerosMita.removeAt(index);
    this.generarDescripcion();
  }

  generarDescripcion() {
    if (this.usuariosEncontrados.length > 0) {
      const nombres = this.usuariosEncontrados.map((u) =>
        `${u.primerNombre} ${u.segundoNombre} ${u.primerApellido} ${u.segundoApellido}`.replace(/\s+/g, ' ').trim()
      );
      this.descripcionGenerada = `Grupo de hermanos: ${nombres.join(', ')}`;
    }
  }

  enviarFormulario() {
    if (this.gemelosForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor complete todos los campos requeridos.',
      });
      return;
    }

    const numeros = this.numerosMita.controls.map((c) => c.value.numero);
    const fecha = this.gemelosForm.get('fechaNacimientoComun')?.value;

    // Reutiliza la lógica de buscarUsuarios
    this.usuarioService.buscarNumerosMitas(numeros, fecha).subscribe({
      next: (resp) => {
        if (!resp.ok || !resp.usuarios) {
          Swal.fire({
            icon: 'error',
            title: 'Error al buscar usuarios',
            text: 'No se pudo obtener la información de los usuarios.',
          });
          return;
        }

        this.usuariosEncontrados = resp.usuarios;

        const fechaValida = this.usuariosEncontrados.every((u) => u.fechaNacimiento === fecha);
        if (!fechaValida) {
          Swal.fire({
            icon: 'error',
            title: 'Fechas diferentes',
            text: 'Los usuarios no tienen la misma fecha de nacimiento.',
          });
          return;
        }

        // Validaciones de cantidad y fecha
        if (this.usuariosEncontrados.length !== numeros.length) {
          Swal.fire({
            icon: 'warning',
            title: 'Usuarios no encontrados',
            text: 'Uno o más números Mita no corresponden a usuarios válidos o con la misma fecha de nacimiento.',
          });
          return;
        }

        // Reutiliza la generación de descripción
        this.generarDescripcion();

        const { tipo } = this.gemelosForm.value;
        const ids = this.usuariosEncontrados.map((u) => u.id);

        const data = {
          tipo,
          descripcion: this.descripcionGenerada,
          fechaNacimientoComun: fecha,
          usuarios: ids,
        };

        this.gemelosService.enviarGrupoGemelos(data).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Grupo guardado',
              text: 'El grupo de gemelos ha sido registrado exitosamente.',
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error al guardar',
              text: 'Ocurrió un error al registrar el grupo. Intente de nuevo.',
            });
          },
        });
      },
      error: (error) => {
        this.manejarError(error);
      },
    });
  }

  manejarError(error: any): void {
    if (error?.error?.msg) {
      Swal.fire({
        icon: 'info',
        html: error.error.msg,
      });
    }

    if (error?.error?.errors) {
      const errores = error.error.errors;
      const listaErrores: string[] = [];

      // Iteramos sobre los errores y los formateamos para mostrar
      Object.entries(errores).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null && 'msg' in value) {
          listaErrores.push(`° ${value['msg']}<br>`);
        }
      });

      Swal.fire({
        icon: 'error',
        html: listaErrores.join(''), // Unimos todos los errores en un string HTML
      });
    } else {
      // Si no se reciben errores específicos, mostramos un mensaje genérico
      Swal.fire({
        icon: 'info',
        html: error?.error?.msg,
      });
    }
  }
}
