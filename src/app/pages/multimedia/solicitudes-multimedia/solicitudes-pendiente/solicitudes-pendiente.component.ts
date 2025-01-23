import Swal from 'sweetalert2';
import { Component } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { CargandoInformacionComponent } from 'src/app/components/cargando-informacion/cargando-informacion.component';
import { UsuarioSolicitudMultimediaModel } from 'src/app/core/models/usuario-solicitud.model';
import { SolicitudesMultimediaComponent } from '../../../../components/solicitudes-multimedia/solicitudes-multimedia.component';
import { UsuarioSolicitudInterface } from 'src/app/core/interfaces/solicitud-multimedia.interface';
import { configuracion } from 'src/environments/config/configuration';
import { LoginUsuarioCmarLiveInterface } from 'src/app/core/interfaces/acceso-multimedia';
import { ESTADO_SOLICITUD_MULTIMEDIA_ENUM } from 'src/app/core/enums/solicitudMultimendia.enum';
import { denegarSolicitudMultimediaInterface } from 'src/app/core/models/solicitud-multimedia.model';
import { generate } from 'generate-password-browser';
import { AccesoMultimediaService } from 'src/app/services/acceso-multimedia/acceso-multimedia.service';

@Component({
  selector: 'app-solicitudes-pendiente',
  standalone: true,
  imports: [CargandoInformacionComponent, SolicitudesMultimediaComponent],
  templateUrl: './solicitudes-pendiente.component.html',
  styleUrl: './solicitudes-pendiente.component.scss',
})
export class SolicitudesPendienteComponent {
  solicitudes: UsuarioSolicitudMultimediaModel[] = [];

  cargando: boolean = false;
  usuarioId: number;

  // Subscription
  solicitudMultimediaServiceSubscription: Subscription;

  constructor(
    private accesoMultimediaService: AccesoMultimediaService,
    private solicitudMultimediaService: SolicitudMultimediaService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.usuarioId = this.usuarioService.usuario.id;
    this.cargarTodasLasSolicitudes();
  }

  ngOnDestroy(): void {
    this.solicitudMultimediaServiceSubscription?.unsubscribe;
  }

  cargarTodasLasSolicitudes(): void {
    this.cargando = true;

    this.solicitudMultimediaServiceSubscription = this.solicitudMultimediaService
      .getSolicitudesPendientes(this.usuarioId)
      .subscribe({
        next: (data) => {
          this.solicitudes = data;
          this.cargando = false;
        },
        error: (error) => {
          this.handleError(error);
          this.cargando = false;
        },
      });
  }

  crearAccesoMultimedia(solicitud: UsuarioSolicitudInterface) {
    const nombreCompleto = `${solicitud.primerNombre} ${solicitud.segundoNombre} ${solicitud.primerApellido} ${solicitud.segundoApellido}`;
    const loginDefault = solicitud.email;
    const password = this.generarPassword();

    Swal.fire({
      title: 'CMAR LIVE',
      html: `Desea crear acceso a CMAR LIVE al usuario <b>${nombreCompleto}</b>`,
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
          title: `Credenciales para ${nombreCompleto}`,
          html: `
                <div class="form-group">
                  <label class="input-group obligatorio">Login:</label>
                  <input type="text" id="login" name="login" class="form-control" value="${loginDefault}" required />
                </div>
                <div class="form-group">
                  <label class="input-group obligatorio">Tiempo de aprobación:</label>
                  <select id="tiempoAprobacion" name="tiempoAprobacion" class="form-control" required>
                    <option value=null disabled selected>Seleccionar tiempo de aprobación</option>
                    ${configuracion.tiempoSugerido
                      .map((tiempo) => `<option value="${tiempo.value}">${tiempo.label}</option>`)
                      .join('')}
                  </select>
                </div>
              `,
          focusConfirm: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCloseButton: true,
          preConfirm: () => {
            return [
              (document.getElementById('login') as HTMLInputElement).value,
              (document.getElementById('tiempoAprobacion') as HTMLSelectElement).value,
            ];
          },
        });

        if (formValues) {
          const tiempoSeleccionado = formValues[1];
          const tiempoAprobacion = this.calcularFechaDeAprobacion(tiempoSeleccionado);

          const dataAcceso: LoginUsuarioCmarLiveInterface = {
            login: formValues[0],
            password: password,
            solicitud_id: solicitud?.solicitudes[solicitud.solicitudes.length - 1]?.id,
            tiempoAprobacion: tiempoAprobacion ? new Date(tiempoAprobacion) : null,
            usuarioQueAprobo_id: this.usuarioId,
            estado: ESTADO_SOLICITUD_MULTIMEDIA_ENUM.APROBADA,
          };

          this.accesoMultimediaService.crearAccesoMultimedia(dataAcceso).subscribe(
            (accesoCreado: any) => {
              Swal.fire('Acceso creado', 'correctamente', 'success');
              this.cargarTodasLasSolicitudes();
            },
            (error) => {
              let errores = error.error.errors;
              let listaErrores: string[] = [];

              if (!!errores) {
                Object.entries(errores).forEach(([key, value]) => {
                  if (typeof value === 'object' && value !== null && 'msg' in value) {
                    listaErrores.push('° ' + (value as { msg: string })['msg'] + '<br>');
                  }
                });
              }

              Swal.fire({
                icon: 'error',
                html: listaErrores.join('') ? `${listaErrores.join('')}` : error.error.msg,
              });
            }
          );
        }
      } else if (result.isDenied) {
        Swal.fire('No se pudo crear las credenciales de CMAR LIVE', '', 'info');
      }
    });
  }

  denegarAccesoMultimedia(solicitud: UsuarioSolicitudInterface): void {
    const nombre = `${solicitud.primerNombre} ${solicitud.segundoNombre} ${solicitud.primerApellido} ${solicitud.segundoApellido}`;
    Swal.fire({
      title: 'Denegación de Solicitud - CMAR LIVE',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      icon: 'question',
      html: `
        <p>¿Está seguro de que desea denegar el acceso a CMAR LIVE al usuario <b>${nombre}</b>?</p>
        <p><small>Ingrese a continuación el motivo de la negación. Este será enviado al usuario por correo electrónico.</small></p>
        <textarea id="motivo" class="swal2-textarea" placeholder="Escriba aquí el motivo de la negación"></textarea>
      `,
      preConfirm: () => {
        const motivo = (Swal.getPopup()!.querySelector('#motivo') as HTMLTextAreaElement).value;
        if (!motivo) {
          Swal.showValidationMessage('El motivo de la negación es obligatorio. Por favor, complételo.');
        }
        return { motivo };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const motivo = result.value!.motivo;

        const dataDenegar: denegarSolicitudMultimediaInterface = {
          solicitud_id: solicitud.solicitudes[solicitud.solicitudes.length - 1].id,
          motivoDeNegacion: motivo,
        };
        this.solicitudMultimediaService.denegarSolicitudMultimedia(dataDenegar).subscribe((respuesta: any) => {
          Swal.fire({
            title: 'Solicitud Denegada - CMAR LIVE',
            icon: 'warning',
            html: `
              <p>La solicitud de acceso a CMAR LIVE del usuario <b>${nombre}</b> ha sido denegada.</p>
              <p><b>Motivo:</b> ${motivo}</p>
            `,
          });
          this.cargarTodasLasSolicitudes();
        });
      }
    });
  }

  eliminarSolicitudMultimedia(solicitud: UsuarioSolicitudMultimediaModel): void {
    const idUltimaSolicitud = solicitud.ultimaSolicitud.id;
    const nombre = `${solicitud.primerNombre} ${solicitud.segundoNombre} ${solicitud.primerApellido} ${solicitud.segundoApellido}`;
    Swal.fire({
      title: 'CMAR LIVE',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      icon: 'question',
      html: `Desea eliminar la solicitud de acceso a CMAR LIVE del usuario ${nombre}`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudMultimediaService
          .eliminarSolicitudMultimedia(idUltimaSolicitud)
          .pipe(delay(1000))
          .subscribe((respuesta: any) => {
            Swal.fire({
              title: 'CMAR LIVE',
              icon: 'warning',
              html: `Solicitud eliminada correctamente`,
              showCloseButton: true,
            });
          });
        this.cargarTodasLasSolicitudes();
      }
    });
  }

  calcularFechaDeAprobacion(opcion: string): Date | null {
    const cantidad = parseInt(opcion);

    if (isNaN(cantidad) || cantidad <= 0) {
      console.error('La opción debe ser un número entero positivo.');
      return null; // Devolver nulo si la conversión no fue exitosa o si es un número inválido
    }

    const hoy = new Date();
    const fechaFutura = new Date(hoy.getTime() + cantidad * 24 * 60 * 60 * 1000); // Calcular la fecha futura en milisegundos

    return fechaFutura;
  }

  generarPassword() {
    const password = generate({
      length: 10,
      numbers: true,
    });

    return password;
  }

  handleError(error: any) {
    console.error(error);
    Swal.fire({
      title: 'Error',
      icon: 'error',
      html: `Ocurrió un error al cargar las solicitudes de acceso a CMAR LIVE. <br> ${error.error.msg}`,
    });
  }
}
