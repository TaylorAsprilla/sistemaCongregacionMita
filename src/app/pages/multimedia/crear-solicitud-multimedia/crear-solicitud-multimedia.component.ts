import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { PaisModel } from 'src/app/core/models/pais.model';
import { RazonSolicitudModel } from 'src/app/core/models/razon-solicitud.model';
import { SolicitudMultimediaInterface } from 'src/app/core/models/solicitud-multimedia';
import { AccesoMultimediaService } from 'src/app/services/acceso-multimedia/acceso-multimedia.service';
import { BuscarCorreoService } from 'src/app/services/buscar-correo/buscar-correo.service';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-solicitud-multimedia',
  templateUrl: './crear-solicitud-multimedia.component.html',
  styleUrls: ['./crear-solicitud-multimedia.component.scss'],
})
export class CrearSolicitudMultimediaComponent implements OnInit {
  public solicitudForm: FormGroup;

  public paises: PaisModel[] = [];
  public nacionalidades: NacionalidadModel[] = [];
  public congregaciones: CongregacionModel[] = [];
  public razonSolicitudes: RazonSolicitudModel[] = [];

  public mensajeBuscarCorreo: string = '';

  public idUsuario: number;

  // Subscription
  public buscarCorreoSubscription: Subscription;

  codigoDeMarcadoSeparado = false;
  buscarPais = SearchCountryField;
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

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private solicitudMultimediaService: SolicitudMultimediaService,
    private usuarioService: UsuarioService,
    private buscarCorreoService: BuscarCorreoService,
    private accesoMultimediaService: AccesoMultimediaService
  ) {}

  ngOnInit(): void {
    //   this.activateRouter.params.subscribe(({ id }) => {
    //     this.buscarCongregacion(id);
    // }
    this.activatedRoute.data.subscribe(
      (data: {
        nacionalidad: NacionalidadModel[];
        congregacion: CongregacionModel[];
        pais: PaisModel[];
        razonSolicitud: RazonSolicitudModel[];
      }) => {
        this.nacionalidades = data.nacionalidad;
        this.congregaciones = data.congregacion;
        this.paises = data.pais;
        this.razonSolicitudes = data.razonSolicitud;
      }
    );

    this.idUsuario = this.usuarioService?.usuarioLogin.id;

    this.crearFormularioDeLaSolicitud();
  }

  ngOnDestroy(): void {
    this.buscarCorreoSubscription?.unsubscribe();
  }

  crearFormularioDeLaSolicitud() {
    this.solicitudForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', [Validators.required, Validators.minLength(3)]],
      ciudad: ['', [Validators.required, Validators.minLength(3)]],
      departamento: ['', [Validators.minLength(3)]],
      codigoPostal: ['', [Validators.minLength(3)]],
      pais: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.minLength(3)]],
      celular: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        {
          validators: [Validators.required, Validators.minLength(3), Validators.email],
        },
      ],
      miembroCongregacion: ['', [Validators.required]],
      estaCercaACongregacion: [false, [Validators.required]],
      congregacionCercana: ['', [Validators.minLength(3)]],
      razonSolicitud_id: ['', [Validators.required]],
      otraRazonSolicitud: ['', []],
      nacionalidad: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  buscarNacionalidad(formControlName: string) {
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

  buscarIDNacionalidad(nacionalidad: string): number {
    return this.nacionalidades.find((nacionalidades: NacionalidadModel) => nacionalidades.nombre === nacionalidad)?.id;
  }

  buscarCorreo(email: string) {
    this.mensajeBuscarCorreo = '';
    this.buscarCorreoSubscription = this.buscarCorreoService
      .buscarCorreoSolicitud(email)
      .subscribe((respuesta: any) => {
        if (!respuesta.ok) {
          this.mensajeBuscarCorreo = respuesta.msg;
        }
      });
  }

  estaCercaACongregacion() {
    return this.solicitudForm.controls['estaCercaACongregacion'].value || false;
  }

  crearSolicitud() {
    const formSolicitud = this.solicitudForm.value;

    const solicitudNueva: SolicitudMultimediaInterface = {
      nombre: formSolicitud.nombre,
      direccion: formSolicitud.direccion,
      ciudad: formSolicitud.ciudad,
      departamento: formSolicitud.departamento,
      codigoPostal: formSolicitud.codigoPostal,
      pais: formSolicitud.pais,
      telefono: formSolicitud.telefono?.internationalNumber ? formSolicitud.telefono?.internationalNumber : '',
      celular: formSolicitud.celular?.internationalNumber,
      email: formSolicitud.email,
      miembroCongregacion: formSolicitud.miembroCongregacion,
      congregacionCercana: formSolicitud.congregacionCercana,
      razonSolicitud_id: formSolicitud.razonSolicitud_id,
      nacionalidad_id: this.buscarIDNacionalidad(formSolicitud.nacionalidad),
      estado: true,
      status: false,
      usuarioQueRegistra_id: this.idUsuario,
    };

    this.solicitudMultimediaService.crearSolicitudMultimedia(solicitudNueva).subscribe(
      (respuesta: any) => {
        Swal.fire({
          title: 'Solicitud Acceso a cmar.live',
          text: `${respuesta.solicitudDeAcceso.nombre}, por favor revise el correo electrónico ${respuesta.solicitudDeAcceso.email} y realice el proceso de validación para que sea procesada su solicitud`,
          icon: 'success',
        });
        this.resetFormulario();
      },
      (error) => {
        let errores = error.error.errors;
        let listaErrores = [];

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

  resetFormulario() {
    this.solicitudForm.reset();
  }
}
