import { configuracion } from 'src/environments/config/configuration';
import { UsuarioService } from './../../../../services/usuario/usuario.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField, NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { OpcionTransporteModel } from 'src/app/core/models/opcion-transporte.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { ParentescoModel } from 'src/app/core/models/parentesco.model';
import { RazonSolicitudModel } from 'src/app/core/models/razon-solicitud.model';
import { RAZON_SOLICITUD_ID, crearSolicitudMultimediaInterface } from 'src/app/core/models/solicitud-multimedia.model';
import { TipoEstudioModel } from 'src/app/core/models/tipo-estudio.model';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';
import Swal from 'sweetalert2';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { BuscarUsuarioComponent } from '../../../../components/buscar-usuario/buscar-usuario.component';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-crear-solicitud-multimedia',
  templateUrl: './crear-solicitud-multimedia.component.html',
  styleUrls: ['./crear-solicitud-multimedia.component.scss'],
  standalone: true,
  imports: [
    BuscarUsuarioComponent,
    FormsModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    AsyncPipe,
  ],
})
export class CrearSolicitudMultimediaComponent implements OnInit, OnDestroy {
  solicitudForm: FormGroup;

  paises: CongregacionPaisModel[] = [];
  nacionalidades: NacionalidadModel[] = [];
  congregaciones: CongregacionModel[] = [];
  razonSolicitudes: RazonSolicitudModel[] = [];
  tipoEstudios: TipoEstudioModel[] = [];
  opcionTransporte: OpcionTransporteModel[] = [];
  parentescos: ParentescoModel[] = [];

  usuario: UsuarioModel;
  mensajeBuscarCorreo: string = '';

  idUsuario: number;
  nombreUsuario: string;
  usuarioQueRegistra: UsuarioModel;

  tiempoSugerido = configuracion.tiempoSugerido;

  // Subscription
  buscarCorreoSubscription: Subscription;
  usuarioSubscription: Subscription;

  codigoDeMarcadoSeparado = false;
  buscarPaisTelefono = SearchCountryField;
  paisISO = CountryISO;
  formatoNumeroTelefonico = PhoneNumberFormat;
  paisesPreferidos: CountryISO[] = [
    CountryISO.PuertoRico,
    CountryISO.Canada,
    CountryISO.Chile,
    CountryISO.Colombia,
    CountryISO.CostaRica,
    CountryISO.Ecuador,
    CountryISO.ElSalvador,
    CountryISO.Spain,
    CountryISO.UnitedStates,
    CountryISO.Italy,
    CountryISO.Mexico,
    CountryISO.Panama,
    CountryISO.Peru,
    CountryISO.DominicanRepublic,
    CountryISO.Venezuela,
  ];

  letrasFiltrarNacionalidad: Observable<NacionalidadModel[]>;
  letrasFiltrarCongregacion: Observable<CongregacionModel[]>;
  pickerTwo: any;

  get RAZON_SOLICITUD_ID() {
    return RAZON_SOLICITUD_ID;
  }

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private solicitudMultimediaService: SolicitudMultimediaService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      (data: {
        nacionalidad: NacionalidadModel[];
        congregacion: CongregacionModel[];
        pais: CongregacionPaisModel[];
        razonSolicitud: RazonSolicitudModel[];
        tipoEstudio: TipoEstudioModel[];
        opcionTransporte: OpcionTransporteModel[];
        parentesco: ParentescoModel[];
      }) => {
        this.nacionalidades = data.nacionalidad;
        this.congregaciones = data.congregacion;
        this.paises = data.pais;
        this.razonSolicitudes = data.razonSolicitud;
        this.tipoEstudios = data.tipoEstudio;
        this.opcionTransporte = data.opcionTransporte;
        this.parentescos = data.parentesco;
      }
    );

    this.idUsuario = this.usuarioService?.usuarioId;
    this.nombreUsuario = this.usuarioService.usuarioNombre;
    this.usuarioQueRegistra = this.usuarioService.usuario;

    this.crearFormularioDeLaSolicitud();
    this.eliminarControles();
  }

  ngOnDestroy(): void {
    this.buscarCorreoSubscription?.unsubscribe();
    this.usuarioSubscription?.unsubscribe();
  }

  crearFormularioDeLaSolicitud() {
    this.solicitudForm = this.formBuilder.group({
      estaCercaACongregacion: [false, [Validators.required]],
      congregacionCercana: ['', [Validators.minLength(3)]],
      razonSolicitud_id: ['', [Validators.required]],
      otraRazon: ['', []],
      observaciones: ['', [Validators.minLength(3)]],
      tiempoSugerido: ['', []],
      terminos: ['', [Validators.required, Validators.requiredTrue]],
    });
  }

  buscarFeligres(usuario: UsuarioModel) {
    this.usuario = usuario;
    this.numeroMita();
  }

  numeroMita(): number {
    return this.usuario?.id;
  }

  buscarPais(formControlName: string) {
    this.letrasFiltrarNacionalidad;
    this.letrasFiltrarNacionalidad = this.solicitudForm.get(formControlName.toString()).valueChanges.pipe(
      startWith(''),
      map((valor) => this.filtrar(valor || ''))
    );
  }

  private filtrar(valor: string): NacionalidadModel[] {
    const filtrarValores = valor.toLowerCase();

    return this.nacionalidades.filter((nacionalidad: NacionalidadModel) =>
      nacionalidad.nombre.toLowerCase().includes(filtrarValores)
    );
  }

  buscarCongregacion(formControlName: string) {
    this.letrasFiltrarCongregacion = this.solicitudForm.get(formControlName.toString()).valueChanges.pipe(
      startWith(''),
      map((valor) => this.filtrarCongregacion(valor || ''))
    );
  }

  private filtrarCongregacion(valor: string): CongregacionModel[] {
    const filtrarCongregaciones = valor.toLowerCase();

    return this.congregaciones.filter((congregacion: CongregacionModel) =>
      congregacion.congregacion.toLowerCase().includes(filtrarCongregaciones)
    );
  }

  estaCercaACongregacion() {
    return this.solicitudForm.controls['estaCercaACongregacion'].value || false;
  }

  esPersonaEncamada() {
    return this.solicitudForm?.controls['personaEncamada'].value || false;
  }

  tipoDeSolicitud(tipo: string) {
    this.eliminarControles();

    if (tipo === RAZON_SOLICITUD_ID.ESTUDIANTE) {
      this.agregarControlEsEstudiante();
    } else if (tipo === RAZON_SOLICITUD_ID.FUERZAS_ARMADAS) {
      this.agregarControlBaseMilitar();
    } else if (tipo === RAZON_SOLICITUD_ID.DISTANCIA_AL_TEMPLO_MAS_CERCANO) {
      this.agregarControlOpcionesDeTransporte();
    } else if (tipo === RAZON_SOLICITUD_ID.ENFERMEDAD) {
      this.agregarControlEnfermedad();
    }
  }

  agregarControlEsEstudiante() {
    this.solicitudForm = this.formBuilder.group({
      ...this.solicitudForm.controls,
      paisDondeEstudia: ['', [Validators.minLength(3), Validators.required]],
      ciudadDondeEstudia: ['', [Validators.minLength(3), Validators.required]],
      tipoDeEstudio_id: ['', [Validators.required]],
      duracionDelPeriodoDeEstudio: ['', [Validators.required]],
    });
    return true;
  }

  eliminarControlEsEstudiante() {
    this.solicitudForm.removeControl('paisDondeEstudia');
    this.solicitudForm.removeControl('ciudadDondeEstudia');
    this.solicitudForm.removeControl('tipoDeEstudio_id');
    this.solicitudForm.removeControl('duracionDelPeriodoDeEstudio');

    return true;
  }

  agregarControlBaseMilitar() {
    this.solicitudForm = this.formBuilder.group({
      ...this.solicitudForm.controls,
      baseMilitar: ['', [Validators.minLength(3), Validators.required]],
    });
    return true;
  }

  eliminarControlBaseMilitar() {
    this.solicitudForm.removeControl('baseMilitar');

    return true;
  }

  agregarControlOpcionesDeTransporte() {
    this.solicitudForm = this.formBuilder.group({
      ...this.solicitudForm.controls,
      horaTemploMasCercano: ['', [Validators.min(1), Validators.max(24), Validators.required]],
      opcionTransporte_id: ['', [Validators.required]],
    });
    return true;
  }

  eliminarControlOpcionesDeTransporte() {
    this.solicitudForm.removeControl('horaTemploMasCercano');
    this.solicitudForm.removeControl('opcionTransporte_id');

    return true;
  }

  agregarControlEnfermedad() {
    this.solicitudForm = this.formBuilder.group({
      ...this.solicitudForm.controls,
      personaEncamada: ['', [Validators.required]],
      enfermedadQuePadece: ['', [Validators.minLength(3)]],
    });
    return true;
  }

  agregarControlPersonaEncamada() {
    this.solicitudForm = this.formBuilder.group({
      ...this.solicitudForm.controls,
      personaEncargada: ['', [Validators.minLength(3), Validators.required]],
      parentesco_id: ['', [Validators.required]],
      celularPersonaEncargada: ['', [Validators.minLength(3), Validators.required]],
      enfermedadCronica: ['', [Validators.required]],
      enfermedadQuePadece: ['', [Validators.minLength(3)]],
    });
    return true;
  }

  eliminarControlEnfermedad() {
    this.solicitudForm.removeControl('personaEncamada');
    this.solicitudForm.removeControl('enfermedadQuePadece');

    return true;
  }

  eliminarControlPersonaEncamada() {
    this.solicitudForm.removeControl('personaEncargada');
    this.solicitudForm.removeControl('parentesco_id');
    this.solicitudForm.removeControl('celularPersonaEncargada');
    this.solicitudForm.removeControl('enfermedadCronica');

    return true;
  }

  eliminarControles() {
    this.eliminarControlEsEstudiante();
    this.eliminarControlBaseMilitar();
    this.eliminarControlOpcionesDeTransporte();
    this.eliminarControlEnfermedad();
    this.eliminarControlPersonaEncamada();
  }

  crearSolicitud() {
    if (this.solicitudForm.valid) {
      const formSolicitud = this.solicitudForm.value;

      const solicitudNueva: crearSolicitudMultimediaInterface = {
        usuario_id: this.usuario.id,
        razonSolicitud_id: formSolicitud.razonSolicitud_id,
        otraRazon: formSolicitud.otraRazon,
        estado: true,
        usuarioQueRegistra_id: this.idUsuario,
        duracionDelPeriodoDeEstudio: formSolicitud.duracionDelPeriodoDeEstudio
          ? formSolicitud.duracionDelPeriodoDeEstudio
          : null,
        baseMilitar: formSolicitud.baseMilitar ? formSolicitud.baseMilitar : '',
        observaciones: formSolicitud.observaciones ? formSolicitud.observaciones : '',
        opcionTransporte_id: formSolicitud.opcionTransporte_id ? formSolicitud.opcionTransporte_id : null,
        tipoDeEstudio_id: formSolicitud.tipoDeEstudio_id ? formSolicitud.tipoDeEstudio_id : null,
        parentesco_id: formSolicitud.parentesco_id ? formSolicitud.parentesco_id : null,
        tiempoDistancia: formSolicitud.tiempoDistancia ? formSolicitud.tiempoDistancia : '',
        horaTemploMasCercano: formSolicitud.horaTemploMasCercano ? formSolicitud.horaTemploMasCercano : '',
        personaEncamada: formSolicitud.personaEncamada ? formSolicitud.personaEncamada : 0,
        personaEncargada: formSolicitud.personaEncargada ? formSolicitud.personaEncargada : '',
        enfermedadCronica: formSolicitud.enfermedadCronica ? formSolicitud.enfermedadCronica : '',
        enfermedadQuePadece: formSolicitud.enfermedadQuePadece ? formSolicitud.enfermedadQuePadece : '',
        paisDondeEstudia: formSolicitud.paisDondeEstudia ? formSolicitud.paisDondeEstudia : '',
        ciudadDondeEstudia: formSolicitud.ciudadDondeEstudia ? formSolicitud.ciudadDondeEstudia : '',
        terminos: formSolicitud.terminos ? formSolicitud.terminos : false,
        emailVerificado: false,
        tiempoAprobacion: null,
        usuario: this.usuario,
        usuarioQueRegistra: this.usuarioQueRegistra,
        tipoMiembro: this.usuario.tipoMiembro,
        tiempoSugerido: formSolicitud.tiempoSugerido ? formSolicitud.tiempoSugerido : '',
        congregacionCercana: formSolicitud.congregacionCercana,
        celularPersonaEncargada: formSolicitud.celularPersonaEncargada
          ? formSolicitud.celularPersonaEncargada.internationalNumber
          : '',
      };

      this.solicitudMultimediaService.crearSolicitudMultimedia(solicitudNueva).subscribe(
        (respuesta: any) => {
          Swal.fire({
            title: 'Solicitud Acceso a cmar.live',
            html: `<b>${this.usuario.primerNombre} ${this.usuario.segundoNombre}
                ${this.usuario.primerApellido} ${this.usuario.segundoApellido} </b>,
               por favor revise el correo electrónico <b> ${this.usuario.email} </b> y realice el proceso de validación para que sea procesada su solicitud`,
            icon: 'success',
          });
          this.resetFormulario();
          this.usuario = null;
        },
        (error) => {
          const errores = error.error.errors as { [key: string]: { msg: string } };
          const listaErrores: string[] = [];

          Object.entries(errores).forEach(([key, value]) => {
            listaErrores.push('° ' + value['msg'] + '<br>');
          });

          Swal.fire({
            title: 'Error al crear la solicitud de acceso a cmar.live',
            icon: 'error',
            html: `${listaErrores.join('')}`,
          });
        }
      );
    }
  }

  actualizarUsuario(usuario: UsuarioModel) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.USUARIOS}/${usuario.id}`);
  }

  resetFormulario() {
    this.solicitudForm.reset();
  }
}
