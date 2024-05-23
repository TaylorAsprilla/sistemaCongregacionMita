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

@Component({
  selector: 'app-congregaciones',
  templateUrl: './congregaciones.component.html',
  styleUrls: ['./congregaciones.component.css'],
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
    this.activatedRoute.data.subscribe((data: { obrero: UsuarioModel[]; pais: CongregacionPaisModel[] }) => {
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

  buscarPais(idPais: number): string {
    return this.paises.find((pais) => pais.id === idPais)?.pais;
  }

  obtenerFiltroNombre(nombre: string) {
    this.filtroNombre = nombre;
  }

  async crearCredenciales(nombreCongregacion: string, email: string) {
    let congregacion = this.congregaciones.find((congregacion) => congregacion.congregacion === nombreCongregacion);

    if (!email) {
      Swal.fire({
        position: 'top-end',
        html: 'Por favor digite un correo electrónico para la congregación',
        showConfirmButton: false,
        timer: 3000,
      });

      if (congregacion) {
        this.actualizarCongregacion(congregacion.id);
      }
      return;
    }

    if (!congregacion) return;

    let password = this.generarPassword();

    let result = await Swal.fire({
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

    if (result.isConfirmed) {
      const { value: formValues } = await Swal.fire({
        text: `Credenciales para ${congregacion.congregacion}`,
        html:
          `<p>Credenciales para <b>${congregacion.congregacion}</b></p>` +
          `<label class="input-group obligatorio">Login: </label>` +
          `<input type="text" id="email" name="email" class="form-control" value="${congregacion.email}" disabled required />` +
          `<label class="input-group obligatorio">Contraseña: </label>` +
          `<input type="password" id="password" name="password" class="form-control" value="${password}" required />`,
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

      if (formValues) {
        const data: AccesoCongregacionMultimedia = {
          email: email,
          password: formValues[1],
          idCongregacion: congregacion.id,
        };

        this.accesoMultimediaService.crearAccesoCongregacionMultimedia(data).subscribe(
          () => {
            Swal.fire({
              title: 'Acceso creado',
              html: `Por favor revise el correo electrónico: <b>${email}</b>`,
              icon: 'success',
            });
          },
          (error) => {
            const errores = error.error.errors;
            let listaErrores = [];

            if (errores) {
              Object.entries(errores).forEach(([key, value]) => {
                listaErrores.push(`° ${value['msg']}<br>`);
              });
            }

            Swal.fire({
              title: 'El acceso NO ha sido creado',
              icon: 'error',
              html: listaErrores.length ? listaErrores.join('') : error.error.msg,
            });
          }
        );
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
