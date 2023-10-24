import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoginUsuarioCmarLiveInterface } from 'src/app/core/models/acceso-multimedia.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { SolicitudMultimediaInterface, SolicitudMultimediaModel } from 'src/app/core/models/solicitud-multimedia.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { AccesoMultimediaService } from 'src/app/services/acceso-multimedia/acceso-multimedia.service';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';
import Swal from 'sweetalert2';
import { generate } from 'generate-password-browser';
import { TipoMiembroModel } from 'src/app/core/models/tipo.miembro.model';

@Component({
  selector: 'app-solicitud-multimedia',
  templateUrl: './solicitud-multimedia.component.html',
  styleUrls: ['./solicitud-multimedia.component.scss'],
})
export class SolicitudMultimediaComponent implements OnInit, OnDestroy {
  solicitudesDeAccesos: SolicitudMultimediaInterface[] = [];
  nacionalidades: NacionalidadModel[] = [];
  tipoMiembro: TipoMiembroModel[];
  cargando: boolean = false;
  fieldTextType: boolean;

  // Subscription
  public solicitudAccesoSubscription: Subscription;
  public solicitudMultimediaServiceSubscription: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private solicitudMultimediaService: SolicitudMultimediaService,
    private accesoMultimediaService: AccesoMultimediaService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      (data: { tipoMiembro: TipoMiembroModel[]; nacionalidad: NacionalidadModel[] }) => {
        this.tipoMiembro = data.tipoMiembro;
        this.nacionalidades = data.nacionalidad;
      }
    );

    this.cargarSolicitudDeAccesos();
  }

  ngOnDestroy(): void {
    this.solicitudAccesoSubscription?.unsubscribe;
    this.solicitudMultimediaServiceSubscription?.unsubscribe;
  }

  cargarSolicitudDeAccesos() {
    this.cargando = true;
    this.solicitudAccesoSubscription = this.solicitudMultimediaService
      .getSolicitudes()
      .pipe(delay(100))
      .subscribe((solicitudesDeAcceso: SolicitudMultimediaInterface[]) => {
        this.solicitudesDeAccesos = solicitudesDeAcceso.filter(
          (solicitud: SolicitudMultimediaInterface) => solicitud.emailVerificado === true && solicitud.estado === true
        );
        this.cargando = false;
      });
  }

  crearSolicitud() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.SOLICITUD_MULTIMEDIA}/${nuevo}`);
  }

  masInformacion(idSolicitud: number) {
    this.solicitudMultimediaServiceSubscription = this.solicitudMultimediaService
      .getSolicitud(idSolicitud)
      .subscribe((informacionSolicitud: SolicitudMultimediaInterface) => {
        const nombre = `${informacionSolicitud.usuario.primerNombre} ${informacionSolicitud.usuario.segundoNombre} ${informacionSolicitud.usuario.primerApellido} ${informacionSolicitud.usuario.segundoApellido}`;
        const fecha = informacionSolicitud?.usuario.fechaNacimiento
          ? informacionSolicitud?.usuario.fechaNacimiento
          : '';
        const login = informacionSolicitud?.usuario.login ? informacionSolicitud?.usuario?.login : '';
        const usuarioQueLoRegistro = `${informacionSolicitud.usuarioQueRegistra?.primerNombre}
                                      ${informacionSolicitud?.usuarioQueRegistra?.segundoNombre}
                                      ${informacionSolicitud?.usuarioQueRegistra?.primerApellido}
                                      ${informacionSolicitud?.usuarioQueRegistra?.segundoApellido}`;
        const tiempoDeAprobacion = informacionSolicitud?.tiempoAprobacion ? informacionSolicitud?.tiempoAprobacion : '';
        const direccion = informacionSolicitud?.usuario.direccion ? informacionSolicitud?.usuario.direccion : '';
        const ciudad = informacionSolicitud?.usuario.ciudadDireccion
          ? informacionSolicitud?.usuario.ciudadDireccion
          : '';
        const departamento = informacionSolicitud?.usuario.departamentoDireccion
          ? informacionSolicitud?.usuario.departamentoDireccion
          : '';
        const codigoPostal = informacionSolicitud?.usuario.codigoPostalDireccion
          ? informacionSolicitud?.usuario.codigoPostalDireccion
          : '';
        const pais = informacionSolicitud?.usuario.paisDireccion ? informacionSolicitud?.usuario.paisDireccion : '';
        const telefono = informacionSolicitud?.usuario.telefonoCasa ? informacionSolicitud?.usuario.telefonoCasa : '';
        const celular = informacionSolicitud?.usuario.numeroCelular ? informacionSolicitud?.usuario.numeroCelular : '';

        const tipoMiembro = this.buscarTipoMiembro(informacionSolicitud?.usuario.tipoMiembro_id);
        const razonSolicitud =
          informacionSolicitud?.razonSolicitud_id !== 5
            ? informacionSolicitud?.razonSolicitud?.solicitud
            : informacionSolicitud?.razonSolicitud;
        const nacionalidad = this.buscarNacionalidad(informacionSolicitud?.usuario.nacionalidad_id);
        const observaciones = informacionSolicitud?.observaciones ? informacionSolicitud?.observaciones : '';
        const fechaDeSolicitud = informacionSolicitud.createdAt;
        const estado = !!informacionSolicitud?.estado
          ? '<span class="badge badge-primary">Activo</span>'
          : '<span class="badge badge-danger">Deshabilitado</span>';

        Swal.fire({
          icon: 'info',
          text: `${nombre}`,
          html: ` <table class="table table-hover text-start">
                  <thead>
                    <tr>
                      <th scope="col">Item</th>
                      <th scope="col">Valor</th>

                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="col-md-5">Nombre:</td>
                      <td class="col-md-7">${nombre}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Login:</td>
                      <td class="col-md-7">${login}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Registrado por:</td>
                      <td class="col-md-7">
                      ${usuarioQueLoRegistro}
                      </td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Tiempo de Aprobación:</td>
                      <td class="col-md-7">${tiempoDeAprobacion}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">Fecha de Nacimiento:</td>
                      <td class="col-md-7">${fecha}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Nacionalidad:</td>
                      <td class="col-md-7">${nacionalidad}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Dirección:</td>
                      <td class="col-md-7">${direccion}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Ciudad:</td>
                      <td class="col-md-7">${ciudad}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">Departamento:</td>
                      <td class="col-md-7">${departamento}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">Código Postal:</td>
                      <td class="col-md-7">${codigoPostal}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">País:</td>
                      <td class="col-md-7">${pais}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">Teléfono:</td>
                      <td class="col-md-7">${telefono}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">Celular:</td>
                      <td class="col-md-7">${celular}</td>
                    </tr>
                      <tr>
                      <td class="col-md-5">Tipo Miembro:</td>
                      <td class="col-md-7">${tipoMiembro}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Razón de la solicitud:</td>
                      <td class="col-md-7">${razonSolicitud}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">Estado</td>
                      <td class="col-md-7">${estado}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">Observaciones</td>
                      <td class="col-md-7">${observaciones}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">Fecha de solicitud</td>
                      <td class="col-md-7">${new Date(fechaDeSolicitud)}</td>
                    </tr>
                  </tbody>
                </table>`,

          showCloseButton: true,
          showConfirmButton: true,
          confirmButtonText: 'Cerrar',
        });
      });
  }

  crearAccesoMultimedia(solicitud: SolicitudMultimediaInterface) {
    const nombre = `${solicitud.usuario.primerNombre} ${solicitud.usuario.segundoNombre} ${solicitud.usuario.primerApellido} ${solicitud.usuario.segundoApellido}`;
    let password = this.generarPassword();
    Swal.fire({
      title: 'CMAR LIVE',
      html: `Desea crear acceso a CMAR LIVE al usuario <b>${nombre}</b>`,
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
          text: `Credenciales para ${nombre}`,
          html:
            `<p>Credenciales para <b>${nombre}</b></p>` +
            `<label class="input-group obligatorio">Login: </label>
              <input type="text" id="login" name="login" class="form-control"  value="${solicitud.usuario.email}"  required />` +
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

  editarAccesoMultimedia(solicitud: SolicitudMultimediaInterface) {
    const nombre = `${solicitud.usuario.primerNombre} ${solicitud.usuario.segundoNombre} ${solicitud.usuario.primerApellido} ${solicitud.usuario.segundoApellido}`;
    const password = this.generarPassword();
    Swal.fire({
      title: 'CMAR LIVE',
      html: `Desea editar las credenciales de ingreso del usuario ${nombre}`,
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
          text: `Credenciales para ${nombre}`,
          html:
            `<p>Credenciales para <b>${nombre}</b></p>` +
            `<label class="input-group obligatorio">Login: </label>
              <input type="text" id="login" name="login" class="form-control" placeholder="Login" value=${solicitud.usuario.login} required/>` +
            `<label class="input-group obligatorio">Contraseña: </label>
              <input type="password" id="password" name="password" class="form-control" value="${password}" placeholder="Ingrese la contraseña"  required/>` +
            `<label class="input-group obligatorio">Tiempo de aprobación:</label>
               <input type="date" id="tiempoAprobacion" name="tiempoAprobacion" class="form-control" placeholder="Ingrese el tiempo de aprobación" value=${solicitud.tiempoAprobacion} required/>` +
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

          this.accesoMultimediaService.actualizarAccesoMultimedia(dataAcceso, solicitud.id).subscribe(
            (accesoActualizado: any) => {
              Swal.fire(
                'CMAR LIVE',
                `Se han actualizado las credenciales de ingreso correctamente del usuario ${nombre}`,
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

  eliminarAccesoMultimedia(solicitud: SolicitudMultimediaInterface) {
    const nombre = `${solicitud.usuario.primerNombre} ${solicitud.usuario.segundoNombre} ${solicitud.usuario.primerApellido} ${solicitud.usuario.segundoApellido}`;
    Swal.fire({
      title: 'CMAR LIVE',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      icon: 'question',
      html: `Desea deshabilitar el acceso a CMAR LIVE al usuario ${nombre}`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.accesoMultimediaService.eliminarAccesoMultimedia(solicitud.id).subscribe((respuesta: any) => {
          Swal.fire({
            title: 'CMAR LIVE',
            icon: 'warning',
            html: `Se deshabilitó el acceso a CMAR LIVE al usuario ${nombre}`,
            showCloseButton: true,
          });
        });
        this.cargarSolicitudDeAccesos();
      }
    });
  }

  activarAccesoMultimedia(solicitud: SolicitudMultimediaInterface) {
    const nombre = `${solicitud.usuario.primerNombre} ${solicitud.usuario.segundoNombre} ${solicitud.usuario.primerApellido} ${solicitud.usuario.segundoApellido}`;
    Swal.fire({
      title: 'CMAR LIVE',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      icon: 'question',
      html: `Desea activar el acceso a CMAR LIVE al usuario ${nombre}`,
    }).then((result) => {
      if (result.isConfirmed) {
        // this.accesoMultimediaService.activarAccesoMultimedia('').subscribe((respuesta: any) => {
        //   Swal.fire({
        //     title: 'CMAR LIVE',
        //     icon: 'warning',
        //     html: `Se activo el acceso CMAR LIVE al usuario ${nombre}`,
        //   });
        // });
        this.cargarSolicitudDeAccesos();
      }
    });
  }

  denegarAccesoMultimedia(solicitud: SolicitudMultimediaInterface) {
    const nombre = `${solicitud.usuario.primerNombre} ${solicitud.usuario.segundoNombre} ${solicitud.usuario.primerApellido} ${solicitud.usuario.segundoApellido}`;
    Swal.fire({
      title: 'CMAR LIVE',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      icon: 'question',
      html: `Desea denegar la solicitud CMAR LIVE al usuario ${nombre}`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudMultimediaService.eliminarSolicitudMultimedia(solicitud.id).subscribe((respuesta: any) => {
          Swal.fire({
            title: 'CMAR LIVE',
            icon: 'warning',
            html: `Se denego la solicitud de acceso a CMAR LIVE al usuario ${nombre}`,
          });
        });
        this.cargarSolicitudDeAccesos();
      }
    });
  }

  buscarTipoMiembro(id: number): string {
    const miembroEncontrado = this.tipoMiembro.find((miembro) => {
      return miembro.id === id;
    });
    return miembroEncontrado.miembro;
  }

  buscarNacionalidad(id: number): string {
    const nacionalidadEncontrada = this.nacionalidades.find((nacionalidad) => {
      return nacionalidad.id === id;
    });
    return nacionalidadEncontrada.nombre;
  }

  generarPassword() {
    const password = generate({
      length: 10,
      numbers: true,
    });

    return password;
  }
}
