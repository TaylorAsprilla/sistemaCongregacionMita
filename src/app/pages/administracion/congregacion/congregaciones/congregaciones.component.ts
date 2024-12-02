import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import Swal from 'sweetalert2';
import { generate } from 'generate-password-browser';
import { AccesoCongregacionMultimedia } from 'src/app/core/interfaces/acceso-multimedia';
import { AccesoMultimediaService } from 'src/app/services/acceso-multimedia/acceso-multimedia.service';

import { CargandoInformacionComponent } from '../../../../components/cargando-informacion/cargando-informacion.component';
import { FiltrosComponent } from '../../../../components/filtros/filtros.component';
import { FilterByNombrePipePipe } from '../../../../pipes/FilterByNombrePipe/filter-by-nombre-pipe.pipe';

@Component({
  selector: 'app-congregaciones',
  templateUrl: './congregaciones.component.html',
  styleUrls: ['./congregaciones.component.css'],
  standalone: true,
  imports: [CargandoInformacionComponent, FiltrosComponent, FilterByNombrePipePipe],
})
export class CongregacionesComponent implements OnInit, OnDestroy {
  cargando: boolean = true;
  congregaciones: CongregacionModel[] = [];
  obreros: UsuarioModel[] = [];
  paises: CongregacionPaisModel[] = [];

  filtroNombre: string = '';

  // Subscription
  congregacionSubscription: Subscription;

  constructor(
    private router: Router,
    private congregacionService: CongregacionService,
    private accesoMultimediaService: AccesoMultimediaService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: any) => {
      this.obreros = data.obrero;
      this.paises = data.pais;
    });

    this.cargarCongregaciones();
  }

  ngOnDestroy(): void {
    this.congregacionSubscription?.unsubscribe();
  }

  cargarCongregaciones() {
    this.cargando = true;
    this.congregacionSubscription = this.congregacionService
      .getCongregaciones()
      .pipe(delay(100))
      .subscribe((congregaciones: CongregacionModel[]) => {
        this.congregaciones = congregaciones;
        this.cargando = false;
      });
  }

  borrarCongregacion(congregacion: CongregacionModel) {
    Swal.fire({
      title: '¿Borrar Congregación?',
      text: `Esta seguro de borrar la congregación de ${congregacion.congregacion}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.congregacionService.eliminarCongregacion(congregacion).subscribe((congregacionEliminado) => {
          Swal.fire(
            '¡Deshabilitado!',
            `La congregación ${congregacion.congregacion} fue deshabilitada correctamente`,
            'success'
          );

          this.cargarCongregaciones();
        });
      }
    });
  }

  activarCongregacion(congregacion: CongregacionModel) {
    Swal.fire({
      title: 'Activar Congregación',
      text: `Esta seguro de activar la congregación de ${congregacion.congregacion}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.congregacionService.activarCongregacion(congregacion).subscribe((congregacionActiva) => {
          Swal.fire('¡Activado!', `La congregación ${congregacion.congregacion} fue activada correctamente`, 'success');

          this.cargarCongregaciones();
        });
      }
    });
  }

  actualizarCongregacion(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.CONGREGACIONES}/${id}`);
  }

  crearCongregacion() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.CONGREGACIONES}/${nuevo}`);
  }

  buscarObrero(idObrero: number): string {
    let obrero = this.obreros.find((obrero) => obrero.id === idObrero);

    const nombreObrero = obrero
      ? obrero?.primerNombre +
        ' ' +
        obrero?.segundoNombre +
        ' ' +
        obrero?.primerApellido +
        ' ' +
        obrero?.segundoApellido
      : 'Sin obrero Asignado';

    return nombreObrero;
  }

  buscarPais(idPais: number): string | undefined {
    return this.paises.find((pais) => pais.id === idPais)?.pais;
  }

  obtenerFiltroNombre(nombre: string) {
    this.filtroNombre = nombre;
  }

  async crearCredenciales(nombreCongregacion: string, email: string): Promise<void> {
    // Buscar la congregación por nombre
    let congregacion = this.congregaciones.find((congregacion) => congregacion.congregacion === nombreCongregacion);

    // Validar que el correo electrónico esté presente
    if (!email) {
      Swal.fire({
        position: 'top-end',
        html: 'Por favor digite un correo electrónico para la congregación',
        showConfirmButton: false,
        timer: 3000,
      });

      // Si la congregación existe, actualizarla
      if (congregacion) {
        this.actualizarCongregacion(congregacion.id);
      }
      return;
    }

    // Si la congregación no existe, salir de la función
    if (!congregacion) return;

    // Generar una nueva contraseña
    let password = this.generarPassword();

    // Mostrar el cuadro de diálogo de confirmación
    const result = await Swal.fire({
      title: 'CMAR LIVE',
      html: `¿Desea crear acceso a CMAR LIVE para la congregación <b>${congregacion.congregacion}</b>?`,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      icon: 'question',
    });

    // Si el usuario confirma, mostrar el formulario para las credenciales
    if (result.isConfirmed) {
      const { value: formValues } = await Swal.fire({
        text: `Credenciales para ${congregacion.congregacion}`,
        html: `
          <p>Credenciales para <b>${congregacion.congregacion}</b></p>
          <label class="input-group obligatorio">Login: </label>
          <input type="text" id="email" name="email" class="form-control" value="${congregacion.email}" disabled required />
          <label class="input-group obligatorio">Contraseña: </label>
          <input type="password" id="password" name="password" class="form-control" value="${password}" required />
        `,
        focusConfirm: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCloseButton: true,
        preConfirm: () => {
          return [
            (document.getElementById('email') as HTMLInputElement).value,
            (document.getElementById('password') as HTMLInputElement).value,
          ];
        },
      });

      // Si se han ingresado los valores del formulario
      if (formValues) {
        const data: AccesoCongregacionMultimedia = {
          email: email,
          password: formValues[1], // La contraseña que se ingresó en el formulario
          idCongregacion: congregacion.id,
        };

        // Crear el acceso en el servicio
        this.accesoMultimediaService.crearAccesoCongregacionMultimedia(data).subscribe({
          next: () => {
            Swal.fire({
              title: 'Acceso creado',
              html: `Por favor revise el correo electrónico: <b>${email}</b>`,
              icon: 'success',
            });
          },
          error: (error) => {
            const errores = error.error?.errors;
            let listaErrores: string[] = [];

            // Manejar errores y mostrarlos de manera adecuada
            if (errores) {
              Object.entries(errores).forEach(([key, value]) => {
                // Asegurarse de que 'value' sea un objeto con la propiedad 'msg'
                if (value && typeof value === 'object' && 'msg' in value) {
                  listaErrores.push(`° ${value['msg']}<br>`);
                }
              });
            }

            Swal.fire({
              title: 'El acceso NO ha sido creado',
              icon: 'error',
              html: listaErrores.length ? listaErrores.join('') : error.error?.msg || 'Hubo un error desconocido.',
            });
          },
        });
      }
    } else if (result.isDenied) {
      Swal.fire('No se pudo crear las credenciales de CMAR LIVE', '', 'info');
    }
  }

  generarPassword() {
    const password = generate({
      length: 10,
      numbers: true,
    });

    return password;
  }
}
