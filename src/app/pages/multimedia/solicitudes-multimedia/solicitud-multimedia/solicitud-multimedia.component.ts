import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoginUsuarioCmarLiveInterface } from 'src/app/core/models/acceso-multimedia.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { RazonSolicitudModel } from 'src/app/core/models/razon-solicitud.model';
import { SolicitudMultimediaModel } from 'src/app/core/models/solicitud-multimedia';
import { RUTAS } from 'src/app/routes/menu-items';
import { AccesoMultimediaService } from 'src/app/services/acceso-multimedia/acceso-multimedia.service';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';
import Swal from 'sweetalert2';
import { generate } from 'generate-password-browser';

@Component({
  selector: 'app-solicitud-multimedia',
  templateUrl: './solicitud-multimedia.component.html',
  styleUrls: ['./solicitud-multimedia.component.scss'],
})
export class SolicitudMultimediaComponent implements OnInit, OnDestroy {
  solicitudesDeAccesos: SolicitudMultimediaModel[] = [];
  razonSolicitudes: RazonSolicitudModel[] = [];
  nacionalidades: NacionalidadModel[] = [];
  cargando: boolean = false;
  fieldTextType: boolean;

  // Subscription
  public solicitudAccesoSubscription: Subscription;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private solicitudMultimediaService: SolicitudMultimediaService,
    private accesoMultimediaService: AccesoMultimediaService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      (data: { razonSolicitud: RazonSolicitudModel[]; nacionalidad: NacionalidadModel[] }) => {
        this.razonSolicitudes = data.razonSolicitud;
        this.nacionalidades = data.nacionalidad;
      }
    );

    this.cargarSolicitudDeAccesos();
  }

  ngOnDestroy(): void {
    this.solicitudAccesoSubscription?.unsubscribe;
  }

  cargarSolicitudDeAccesos() {
    this.cargando = true;
    this.solicitudAccesoSubscription = this.solicitudMultimediaService
      .getSolicitudes()
      .pipe(delay(100))
      .subscribe((solicitudesDeAcceso: SolicitudMultimediaModel[]) => {
        this.solicitudesDeAccesos = solicitudesDeAcceso.filter(
          (solicitud: SolicitudMultimediaModel) => solicitud.emailVerificado === true && solicitud.estado === true
        );
        this.cargando = false;
      });
  }

  crearSolicitud() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.SOLICITUD_MULTIMEDIA}/${nuevo}`);
  }

  masInformacion(idSolicitud: number) {
    this.solicitudMultimediaService
      .getSolicitud(idSolicitud)
      .subscribe((informacionSolicitud: SolicitudMultimediaModel) => {
        const nombre = informacionSolicitud?.nombre;
        const fecha = informacionSolicitud?.fechaNacimiento;
        const login = informacionSolicitud?.accesoMultimedia?.login
          ? informacionSolicitud?.accesoMultimedia?.login
          : '';
        const usuarioQueLoRegistro = `${informacionSolicitud.usuarioQueRegistra?.primerNombre}
                                      ${informacionSolicitud?.usuarioQueRegistra?.segundoNombre}
                                      ${informacionSolicitud?.usuarioQueRegistra?.primerApellido}
                                      ${informacionSolicitud?.usuarioQueRegistra?.segundoApellido}`;
        const tiempoDeAprobacion = informacionSolicitud?.accesoMultimedia?.tiempoAprobacion
          ? informacionSolicitud?.accesoMultimedia?.tiempoAprobacion
          : '';
        const direccion = informacionSolicitud?.direccion ? informacionSolicitud?.direccion : '';
        const ciudad = informacionSolicitud?.ciudad ? informacionSolicitud?.ciudad : '';
        const departamento = informacionSolicitud?.departamento ? informacionSolicitud?.departamento : '';
        const codigoPostal = informacionSolicitud?.codigoPostal ? informacionSolicitud?.codigoPostal : '';
        const pais = informacionSolicitud?.pais ? informacionSolicitud?.pais : '';
        const telefono = informacionSolicitud?.telefono ? informacionSolicitud?.telefono : '';
        const celular = informacionSolicitud?.celular ? informacionSolicitud?.celular : '';
        const congregacionCercana = informacionSolicitud?.congregacionCercana
          ? informacionSolicitud?.congregacionCercana
          : '';
        const esMiembro = !!informacionSolicitud?.miembroCongregacion ? 'Sí' : 'No';
        const razonSolicitud =
          informacionSolicitud?.razonSolicitud?.id !== 5
            ? informacionSolicitud?.razonSolicitud?.solicitud
            : informacionSolicitud?.otraRazon;
        const nacionalidad = informacionSolicitud?.nacionalidad?.nombre;
        const estado = !!informacionSolicitud?.accesoMultimedia?.estado
          ? '<span class="badge badge-primary">Activo</span>'
          : '<span class="badge badge-danger">Deshabilitado</span>';

        Swal.fire({
          icon: 'info',
          text: `${informacionSolicitud.nombre}`,
          html: ` <table class="table  table-hover text-start">
                  <thead>
                    <tr>
                      <th scope="col">Item</th>
                      <th scope="col">Valor</th>

                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Nombre:</td>
                      <td>${nombre}</td>
                    </tr>
                    <tr>
                      <td>Login:</td>
                      <td>${login}</td>
                    </tr>
                    <tr>
                      <td>Registrado por:</td>
                      <td>
                      ${usuarioQueLoRegistro}
                      </td>
                    </tr>
                    <tr>
                      <td>Tiempo de Aprobación:</td>
                      <td>${tiempoDeAprobacion}</td>
                    </tr>
                     <tr>
                      <td>Fecha de Nacimiento:</td>
                      <td>${fecha}</td>
                    </tr>
                    <tr>
                      <td>Nacionalidad:</td>
                      <td>${nacionalidad}</td>
                    </tr>
                    <tr>
                      <td>Dirección:</td>
                      <td>${direccion}</td>
                    </tr>
                    <tr>
                      <td>Ciudad:</td>
                      <td>${ciudad}</td>
                    </tr>
                     <tr>
                      <td>Departamento:</td>
                      <td>${departamento}</td>
                    </tr>
                     <tr>
                      <td>Código Postal:</td>
                      <td>${codigoPostal}</td>
                    </tr>
                     <tr>
                      <td>País:</td>
                      <td>${pais}</td>
                    </tr>
                     <tr>
                      <td>Teléfono:</td>
                      <td>${telefono}</td>
                    </tr>
                     <tr>
                      <td>Celular:</td>
                      <td>${celular}</td>
                    </tr>
                    <tr>
                      <td>Congregación:</td>
                      <td>${congregacionCercana}</td>
                    </tr>
                      <tr>
                      <td>Es Miembro:</td>
                      <td>${esMiembro}</td>
                    </tr>
                    <tr>
                      <td>Razón de la solicitud:</td>
                      <td>${razonSolicitud}</td>
                    </tr>
                     <tr>
                      <td>Estado</td>
                      <td>${estado}</td>
                    </tr>
                  </tbody>
                </table>`,

          showCloseButton: true,
          showConfirmButton: true,
          confirmButtonText: 'Cerrar',
        });
      });
  }

  crearAccesoMultimedia(solicitud: SolicitudMultimediaModel) {
    let password = this.generarPassword();
    Swal.fire({
      title: 'CMAR LIVE',
      html: `Desea crear acceso a CMAR LIVE al usuario ${solicitud.nombre}`,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      icon: 'question',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: formValues } = await Swal.fire({
          text: `Credenciales para ${solicitud.nombre}`,
          html:
            `<p>Credenciales para <b>${solicitud.nombre}</b></p>` +
            `<label class="input-group obligatorio">Login: </label>
              <input type="text" id="login" name="login" class="form-control"  value="${solicitud.email}"  required />` +
            `<label class="input-group obligatorio">Contraseña: </label>
              <input type="password" id="password" name="password" class="form-control" value="${password}"/>` +
            `<label class="input-group obligatorio">Tiempo de aprobación:</label>
               <input type="date" id="tiempoAprobacion" name="tiempoAprobacion" class="form-control" placeholder="Ingrese el tiempo de aprobación" required/>` +
            `<small class="text-danger text-start">Por favor, diligencie todos los campos</small>`,
          focusConfirm: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCloseButton: true,
          preConfirm: () => {
            return [
              (document.getElementById('login') as HTMLInputElement).value,
              (document.getElementById('password') as HTMLInputElement).value,
              (document.getElementById('tiempoAprobacion') as HTMLInputElement).value,
            ];
          },
        });

        if (formValues) {
          const dataAcceso: LoginUsuarioCmarLiveInterface = {
            login: (document.getElementById('login') as HTMLInputElement).value,
            password: (document.getElementById('password') as HTMLInputElement).value,
            solicitud_id: solicitud.id,
            tiempoAprobacion: new Date((document.getElementById('tiempoAprobacion') as HTMLInputElement).value),
            estado: true,
          };

          this.accesoMultimediaService.crearAccesoMultimedia(dataAcceso).subscribe(
            (accesoCreado: any) => {
              Swal.fire('Acceso creado', 'correctamente', 'success');
              this.cargarSolicitudDeAccesos();
            },
            (error) => {
              let errores = error.error.errors;
              let listaErrores = [];

              if (!!errores) {
                Object.entries(errores).forEach(([key, value]) => {
                  listaErrores.push('° ' + value['msg'] + '<br>');
                });
              }

              Swal.fire({
                title: 'El acceso NO ha sido creado',
                icon: 'error',
                html: listaErrores.join('') ? `${listaErrores.join('')}` : error.error.msg,
              });
            }
          );
        }
      } else if (result.isDenied) {
        Swal.fire('No se pudo crear las credeciales de CMAR LIVE', '', 'info');
      }
    });
  }

  editarAccesoMultimedia(solicitud: SolicitudMultimediaModel) {
    const password = this.generarPassword();
    Swal.fire({
      title: 'CMAR LIVE',
      html: `Desea editar las credenciales de ingreso del usuario ${solicitud.nombre}`,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      icon: 'question',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: formValues } = await Swal.fire({
          text: `Credenciales para ${solicitud.nombre}`,
          html:
            `<p>Credenciales para <b>${solicitud.nombre}</b></p>` +
            `<label class="input-group obligatorio">Login: </label>
              <input type="text" id="login" name="login" class="form-control" placeholder="Login" value=${solicitud.accesoMultimedia.login} required/>` +
            `<label class="input-group obligatorio">Contraseña: </label>
              <input type="password" id="password" name="password" class="form-control" value="${password}" placeholder="Ingrese la contraseña"  required/>` +
            `<label class="input-group obligatorio">Tiempo de aprobación:</label>
               <input type="date" id="tiempoAprobacion" name="tiempoAprobacion" class="form-control" placeholder="Ingrese el tiempo de aprobación" value=${solicitud.accesoMultimedia.tiempoAprobacion} required/>` +
            `<small class="text-danger text-start">Por favor, diligencie todos los campos</small>`,
          focusConfirm: true,
          allowOutsideClick: false,
          showCloseButton: true,
          allowEscapeKey: false,
          preConfirm: () => {
            return [
              (document.getElementById('login') as HTMLInputElement).value,
              (document.getElementById('password') as HTMLInputElement).value,
              (document.getElementById('tiempoAprobacion') as HTMLInputElement).value,
            ];
          },
        });

        if (formValues) {
          const dataAcceso: LoginUsuarioCmarLiveInterface = {
            login: (document.getElementById('login') as HTMLInputElement).value,
            password: (document.getElementById('password') as HTMLInputElement).value,
            solicitud_id: solicitud.id,
            tiempoAprobacion: new Date((document.getElementById('tiempoAprobacion') as HTMLInputElement).value),
            estado: true,
          };

          this.accesoMultimediaService
            .actualizarAccesoMultimedia(dataAcceso, solicitud.accesoMultimedia.solicitud_id)
            .subscribe(
              (accesoActualizado: any) => {
                Swal.fire(
                  'CMAR LIVE',
                  `Se han actualizado las credenciales de ingreso correctamente del usuario ${solicitud.nombre}`,
                  'success'
                );
                this.cargarSolicitudDeAccesos();
              },
              (error) => {
                let errores = error.error.errors;
                let listaErrores = [];

                if (!!errores) {
                  Object.entries(errores).forEach(([key, value]) => {
                    listaErrores.push('° ' + value['msg'] + '<br>');
                  });
                }

                Swal.fire({
                  title: 'El acceso NO ha sido creado',
                  icon: 'error',
                  html: listaErrores.join('') ? `${listaErrores.join('')}` : error.error.msg,
                });
              }
            );
        }
      } else if (result.isDenied) {
        Swal.fire('No se pudo crear las credeciales de CMAR LIVE', '', 'info');
      }
    });
  }

  eliminarAccesoMultimedia(solicitud: SolicitudMultimediaModel) {
    Swal.fire({
      title: 'CMAR LIVE',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      icon: 'question',
      html: `Desea deshabilitar el acceso a CMAR LIVE al usuario ${solicitud.nombre}`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.accesoMultimediaService
          .eliminarAccesoMultimedia(solicitud.accesoMultimedia.id)
          .subscribe((respuesta: any) => {
            Swal.fire({
              title: 'CMAR LIVE',
              icon: 'warning',
              html: `Se deshabilitó el acceso a CMAR LIVE al usuario ${solicitud.nombre}`,
              showCloseButton: true,
            });
          });
        this.cargarSolicitudDeAccesos();
      }
    });
  }

  activarAccesoMultimedia(solicitud: SolicitudMultimediaModel) {
    Swal.fire({
      title: 'CMAR LIVE',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      icon: 'question',
      html: `Desea activar el acceso a CMAR LIVE al usuario ${solicitud.nombre}`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.accesoMultimediaService.activarAccesoMultimedia(solicitud.accesoMultimedia).subscribe((respuesta: any) => {
          Swal.fire({
            title: 'CMAR LIVE',
            icon: 'warning',
            html: `Se activo el acceso CMAR LIVE al usuario ${solicitud.nombre}`,
          });
        });
        this.cargarSolicitudDeAccesos();
      }
    });
  }

  denegarAccesoMultimedia(solicitud: SolicitudMultimediaModel) {
    Swal.fire({
      title: 'CMAR LIVE',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      icon: 'question',
      html: `Desea denegar la solicitud CMAR LIVE al usuario ${solicitud.nombre}`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudMultimediaService.eliminarSolicitudMultimedia(solicitud.id).subscribe((respuesta: any) => {
          Swal.fire({
            title: 'CMAR LIVE',
            icon: 'warning',
            html: `Se denego la solicitud de acceso a CMAR LIVE al usuario ${solicitud.nombre}`,
          });
        });
        this.cargarSolicitudDeAccesos();
      }
    });
  }

  generarPassword() {
    const password = generate({
      length: 10,
      numbers: true,
    });

    return password;
  }
}
