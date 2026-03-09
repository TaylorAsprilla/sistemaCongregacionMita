import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CategoriaProfesionModel } from 'src/app/core/models/categoria-profesion.model';
import { CategoriaProfesionService } from 'src/app/services/categoria-profesion/categoria-profesion.service';
import Swal from 'sweetalert2';

import { CargandoInformacionComponent } from '../../../components/cargando-informacion/cargando-informacion.component';

@Component({
  selector: 'app-categoria-profesion',
  templateUrl: './categoria-profesion.component.html',
  styleUrls: ['./categoria-profesion.component.scss'],
  standalone: true,
  imports: [CargandoInformacionComponent],
})
export class CategoriaProfesionComponent implements OnInit, OnDestroy {
  private categoriaProfesionService = inject(CategoriaProfesionService);

  public cargando: boolean = true;
  public categorias: CategoriaProfesionModel[] = [];

  public categoriaSubscription: Subscription;

  ngOnInit(): void {
    this.cargarCategorias();
  }

  ngOnDestroy(): void {
    this.categoriaSubscription?.unsubscribe();
  }

  cargarCategorias() {
    this.cargando = true;
    this.categoriaSubscription = this.categoriaProfesionService
      .getCategoriasProfesion()
      .pipe(delay(100))
      .subscribe((categorias: CategoriaProfesionModel[]) => {
        this.categorias = categorias;
        this.cargando = false;
      });
  }

  buscarCategoria(id: number) {
    return this.categorias.find((categoria: CategoriaProfesionModel) => categoria.id === id);
  }

  async actualizarCategoria(id: number) {
    let categoria = this.buscarCategoria(id);
    const { value: formValues } = await Swal.fire({
      title: 'Actualizar Categoría de Profesión',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${categoria?.nombre || ''}">
        <textarea id="swal-input2" class="swal2-textarea" placeholder="Descripción">${categoria?.descripcion || ''}</textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          nombre: (document.getElementById('swal-input1') as HTMLInputElement).value,
          descripcion: (document.getElementById('swal-input2') as HTMLTextAreaElement).value,
        };
      },
    });

    if (formValues) {
      const data = {
        nombre: formValues.nombre,
        descripcion: formValues.descripcion,
        id: id,
        estado: true,
      };
      this.categoriaProfesionService.actualizarCategoriaProfesion(data).subscribe(
        (categoriaActualizada: any) => {
          Swal.fire('Actualizado!', `La categoría ${formValues.nombre} se actualizó correctamente`, 'success');
          this.cargarCategorias();
        },
        (error) => {
          let errores = error.error;
          Swal.fire({
            title: 'Error al actualizar',
            icon: 'error',
            html: `${errores?.msg}`,
          });
        },
      );
    }
  }

  borrarCategoria(categoria: CategoriaProfesionModel) {
    Swal.fire({
      title: '¿Borrar Categoría de Profesión?',
      text: `¿Está seguro de deshabilitar ${categoria.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, deshabilitar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaProfesionService.eliminarCategoriaProfesion(categoria).subscribe((categoriaEliminada: any) => {
          Swal.fire('¡Deshabilitado!', `La categoría ${categoria.nombre} fue deshabilitada correctamente`, 'success');
          this.cargarCategorias();
        });
      }
    });
  }

  activarCategoria(categoria: CategoriaProfesionModel) {
    Swal.fire({
      title: 'Activar Categoría de Profesión',
      text: `¿Está seguro de activar ${categoria.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaProfesionService.activarCategoriaProfesion(categoria).subscribe((categoriaActiva: any) => {
          Swal.fire('¡Activado!', `La categoría ${categoria.nombre} fue activada correctamente`, 'success');
          this.cargarCategorias();
        });
      }
    });
  }

  async crearCategoria() {
    const { value: formValues } = await Swal.fire({
      title: 'Nueva Categoría de Profesión',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Nombre">
        <textarea id="swal-input2" class="swal2-textarea" placeholder="Descripción"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          nombre: (document.getElementById('swal-input1') as HTMLInputElement).value,
          descripcion: (document.getElementById('swal-input2') as HTMLTextAreaElement).value,
        };
      },
    });

    if (formValues && formValues.nombre) {
      this.categoriaProfesionService.crearCategoriaProfesion(formValues).subscribe(
        (categoriaCreada: any) => {
          Swal.fire('Creado!', `La categoría ${formValues.nombre} fue creada correctamente`, 'success');
          this.cargarCategorias();
        },
        (error) => {
          Swal.fire({
            title: 'Error al crear',
            icon: 'error',
            html: `${error.error?.msg}`,
          });
        },
      );
    }
  }
}
