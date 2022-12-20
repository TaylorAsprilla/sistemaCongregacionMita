import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginUsuarioCmarLive } from 'src/app/core/models/acceso-multimedia.model';
import { RazonSolicitudModel } from 'src/app/core/models/razon-solicitud.model';
import { SolicitudMultimediaModel } from 'src/app/core/models/solicitud-multimedia';
import { Rutas } from 'src/app/routes/menu-items';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud-multimedia',
  templateUrl: './solicitud-multimedia.component.html',
  styleUrls: ['./solicitud-multimedia.component.scss'],
})
export class SolicitudMultimediaComponent implements OnInit, OnDestroy {
  solicitudesDeAccesos: SolicitudMultimediaModel[] = [];
  razonSolicitudes: RazonSolicitudModel[] = [];
  cargando: boolean = false;

  // Subscription
  public solicitudAccesoSubscription: Subscription;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accesoMultimediaServices: SolicitudMultimediaService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { razonSolicitud: RazonSolicitudModel[] }) => {
      this.razonSolicitudes = data.razonSolicitud;
    });

    this.cargarSolicitudDeAccesos();
  }

  ngOnDestroy(): void {
    this.solicitudAccesoSubscription?.unsubscribe;
  }

  cargarSolicitudDeAccesos() {
    this.cargando = true;
    this.solicitudAccesoSubscription = this.accesoMultimediaServices
      .getSolicitudes()
      .subscribe((solicitudesDeAcceso) => {
        this.solicitudesDeAccesos = solicitudesDeAcceso.filter(
          (solicitud: SolicitudMultimediaModel) => solicitud.status === true
        );
        this.cargando = false;
      });
  }

  crearSolicitud() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.SOLICITUD_MULTIMEDIA}/${nuevo}`);
  }

  masInformacion(idSolicitud: number) {
    this.accesoMultimediaServices
      .getSolicitud(idSolicitud)
      .subscribe((informacionSolicitud: SolicitudMultimediaModel) => {
        const nombre = informacionSolicitud?.nombre;
        const login = informacionSolicitud?.accesoMultimedia?.login
          ? informacionSolicitud?.accesoMultimedia?.login
          : '';
        const usuarioQueLoRegistro = `${informacionSolicitud.usuarioQueRegistra?.primerNombre}
                                      ${informacionSolicitud?.usuarioQueRegistra?.segundoNombre}
                                      ${informacionSolicitud?.usuarioQueRegistra?.primerApellido}
                                      ${informacionSolicitud?.usuarioQueRegistra?.segundoApellido}`;
        const tiempoDeAprobacion = informacionSolicitud?.tiempoAprobación?.tiempo
          ? informacionSolicitud?.tiempoAprobación?.tiempo
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
                      <td>Lo Resgistró:</td>
                      <td>
                      ${usuarioQueLoRegistro}
                      </td>
                    </tr>
                    <tr>
                      <td>Tiempo de Aprobación</td>
                      <td>${tiempoDeAprobacion}</td>
                    </tr>
                    <tr>
                      <td>Dirección</td>
                      <td>${direccion}</td>
                    </tr>
                    <tr>
                      <td>Ciudad</td>
                      <td>${ciudad}</td>
                    </tr>
                     <tr>
                      <td>Departamento</td>
                      <td>${departamento}</td>
                    </tr>
                     <tr>
                      <td>Código Postal</td>
                      <td>${codigoPostal}</td>
                    </tr>
                     <tr>
                      <td>País</td>
                      <td>${pais}</td>
                    </tr>
                     <tr>
                      <td>Telefono</td>
                      <td>${telefono}</td>
                    </tr>
                     <tr>
                      <td>Celular</td>
                      <td>${celular}</td>
                    </tr>
                    <tr>
                      <td>Congregación</td>
                      <td>${congregacionCercana}</td>
                    </tr>
                      <tr>
                      <td>Es Miembro</td>
                      <td>${esMiembro}</td>
                    </tr>
                      <tr>
                      <td>Razón de la solicitud</td>
                      <td>${razonSolicitud}</td>
                    </tr>

                  </tbody>
                </table>`,

          showCloseButton: true,
          showConfirmButton: true,
          confirmButtonText: 'Cerrar',
        });
      });
  }

  aceptarSolicitud(solicitud: SolicitudMultimediaModel) {
    Swal.fire({
      title: 'Crear Acceso a CMAR LIVE',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const { value: formValues } = await Swal.fire({
          text: `Credenciales para ${solicitud.nombre}`,

          html:
            `<p>Credenciales para <b>${solicitud.nombre}</b></p>` +
            `<label class="input-group obligatorio">Login: </label>
              <input type="text" id="login" name="login" class="form-control" placeholder="Login" required />` +
            `<label class="input-group obligatorio">Contraseña: </label>
              <input type="password" id="password" name="password" class="form-control" placeholder="Ingrese la contraseña" required/>` +
            `<label class="input-group obligatorio">Tiempo de aprobación:</label>
               <input type="date" id="tiempoAprobacion" name="tiempoAprobacion" class="form-control" placeholder="Ingrese el tiempo de aprobación" required/>` +
            `<small class="text-danger text-start">Si el tiempo de aprobación es vitalicio, NO debe seleccionar la fecha</small>`,
          focusConfirm: true,

          preConfirm: () => {
            return [
              (document.getElementById('login') as HTMLInputElement).value,
              (document.getElementById('password') as HTMLInputElement).value,
              (document.getElementById('tiempoAprobacion') as HTMLInputElement).value,
            ];
          },
        });

        if (formValues) {
          Swal.fire(JSON.stringify(formValues));
        }
      } else if (result.isDenied) {
        Swal.fire('No se pudo crear las credecciales de CMAR LIVE', '', 'info');
      }
    });
    let data: LoginUsuarioCmarLive = {
      id: 0,
      login: '',
      password: '',
      solicitud_id: solicitud.id,
      tiempoAprobacion_id: 0,
      estado: false,
    };

    // this.accesoMultimediaServices.crearSolicitudMultimedia();
  }

  deshabilitarSolicitud() {
    Swal.fire('Solicitud Deshabilitada', 'La solicitud se deshabilito exitosamente', 'success');
  }

  desAprobarSolicitud() {
    Swal.fire('No aprobado', 'La solicitud no se aprobó', 'success');
  }
}
