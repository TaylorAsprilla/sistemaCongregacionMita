import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Observable, Subscription } from 'rxjs';
import { delay, map, startWith } from 'rxjs/operators';
import { RegisterFormInterface, TIPO_DIRECCION } from 'src/app/core/interfaces/register-form.interface';
import { UsuarioInterface } from 'src/app/core/interfaces/usuario.interface';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { DosisModel } from 'src/app/core/models/dosis.model';
import { EstadoCivilModel } from 'src/app/core/models/estado-civil.model';
import { FuenteIngresoModel } from 'src/app/core/models/fuente-ingreso.model';
import { GeneroModel } from 'src/app/core/models/genero.model';
import { GradoAcademicoModel } from 'src/app/core/models/grado-academico.model';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { PaisModel } from 'src/app/core/models/pais.model';
import { RolCasaModel } from 'src/app/core/models/rol-casa.model';
import { TipoDocumentoModel } from 'src/app/core/models/tipo-documento.model';
import { TipoEmpleoModel } from 'src/app/core/models/tipo-empleo.model';
import { TipoMiembroModel } from 'src/app/core/models/tipo.miembro.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { VacunaModel } from 'src/app/core/models/vacuna.model';
import { VoluntariadoModel } from 'src/app/core/models/voluntariado.model';
import { BuscarCorreoService } from 'src/app/services/buscar-correo/buscar-correo.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informacion-usuario',
  templateUrl: './informacion-usuario.component.html',
  styleUrls: ['./informacion-usuario.component.scss'],
})
export class InformacionUsuarioComponent implements OnInit {
  // public usuarioForm: FormGroup;
  public registroUnoForm!: FormGroup;
  public registroDosForm!: FormGroup;
  public registroTresForm!: FormGroup;
  public registroCuatroForm!: FormGroup;

  public registroUno_step = false;
  public registroDos_step = false;
  public registroTres_step = false;
  public step: number = 1;

  @Input() public usuario: UsuarioModel;
  @Input() public usuarios: UsuarioModel[] = [];
  @Input() public generos: GeneroModel[] = [];
  @Input() public estadoCivil: EstadoCivilModel[] = [];
  @Input() public rolCasa: RolCasaModel[] = [];
  @Input() public paises: PaisModel[] = [];
  @Input() public congregaciones: CongregacionModel[] = [];
  @Input() public campos: CampoModel[] = [];
  @Input() public vacunas: VacunaModel[] = [];
  @Input() public dosis: DosisModel[] = [];
  @Input() public nacionalidades: NacionalidadModel[] = [];
  @Input() public fuenteDeIngresos: FuenteIngresoModel[] = [];
  @Input() public gradosAcademicos: GradoAcademicoModel[] = [];
  @Input() public tiposEmpleos: TipoEmpleoModel[] = [];
  @Input() public tipoMiembros: TipoMiembroModel[] = [];
  @Input() public ministerios: MinisterioModel[] = [];
  @Input() public voluntariados: VoluntariadoModel[] = [];
  @Input() public tiposDeDocumentos: TipoDocumentoModel[] = [];
  @Input() public tipoDeDocumentosFiltrados: TipoDocumentoModel[] = [];
  @Input() public ministeriosUsuario: number[] = [];

  @Input() usuarioForm: FormGroup;
  @Input() codigoDeMarcadoSeparado = false;
  @Input() buscarPais = SearchCountryField;
  @Input() paisISO = CountryISO;
  @Input() formatoNumeroTelefonico = PhoneNumberFormat;
  @Input() paisesPreferidos: CountryISO[] = [
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
  @Input() operacion: string;

  @Output() usuarioNuevo = new EventEmitter<RegisterFormInterface>();

  letrasFiltrarNacionalidad: Observable<NacionalidadModel[]>;

  public usuarioSeleccionado: UsuarioModel;
  public congregacionesFiltradas: CongregacionModel[] = [];
  public camposFiltrados: CampoModel[] = [];

  public mensajeBuscarCorreo: string = '';
  public sinCongregacion: number;
  public sinCampo: number;

  fechaDeNacimiento: Date | string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellio: string;
  apodo: string;
  email: string;
  genero_id: number | string;
  estadoCivil_id: number | string;
  nacionalidad: string;
  rolEnCasa: number | string;
  celular: string;
  telefonoCasa: string;
  direccionResidencia: string;
  ciudadResidencia: string;
  departamentoResidencia: string;
  codigoPostalResidencia: string;
  paisResidencia: string;
  direccionPostal: string;
  ciudadPostal: string;
  departamentoPostal: string;
  codigoPostal: string;
  paisPostal: string;
  fuenteDeIngresos_id: FuenteIngresoModel[] | string;
  ingresoMensual: string;
  gradoAcademico: number | string;
  tipoEmpleo: number | string;
  especializacionEmpleo: number | string;
  tipoMiembro: number | string;
  esjoven: boolean;
  ejerMinisterio: boolean;
  voluntario: boolean;
  ministerioUsuario: number[];
  voluntarioUsuario: VoluntariadoModel[];
  congregacionPais: number | string;
  congreacionCiudad: number | string;
  congregacionCampo: number | string;
  vacuna: number | string;
  dosisUsuario: number | string;

  // Subscription
  public usuarioSubscription: Subscription;
  public buscarCorreoSubscription: Subscription;
  public buscarCelularSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private buscarCorreoService: BuscarCorreoService
  ) {}

  ngOnInit(): void {
    this.informacionDelUsuario();
    this.crearFormularios();
    this.agregarControlTipoDocumento();
  }

  informacionDelUsuario() {
    this.fechaDeNacimiento = this.usuario.fechaNacimiento ? this.usuario.fechaNacimiento : '';
    this.primerNombre = this.usuario.primerNombre ? this.usuario.primerNombre : '';
    this.segundoNombre = this.usuario.segundoNombre ? this.usuario.segundoNombre : '';
    this.primerApellido = this.usuario.primerApellido ? this.usuario.primerApellido : '';
    this.segundoApellio = this.usuario.segundoApellido ? this.usuario.segundoApellido : '';
    this.apodo = this.usuario.apodo ? this.usuario.apodo : '';
    this.email = this.usuario.email ? this.usuario.email : '';
    this.genero_id = this.usuario.genero_id ? this.usuario.genero_id : '';
    this.estadoCivil_id = this.usuario.estadoCivil_id ? this.usuario.estadoCivil_id : '';
    this.nacionalidad = this.usuario.nacionalidad?.nombre ? this.usuario.nacionalidad?.nombre : '';
    this.rolEnCasa = this.usuario.rolCasa_id ? this.usuario.rolCasa_id : '';
    this.celular = this.usuario.numeroCelular ? this.usuario.numeroCelular : '';
    this.telefonoCasa = this.usuario.telefonoCasa ? this.usuario.telefonoCasa : '';
    this.direccionResidencia = this.usuario.direcciones.find(
      (direccion) => direccion?.tipoDireccion_id === TIPO_DIRECCION.DIRECCION_RESIDENCIAL
    )?.direccion;
    this.ciudadResidencia = this.usuario.direcciones.find(
      (direccion) => direccion?.tipoDireccion_id === TIPO_DIRECCION.DIRECCION_RESIDENCIAL
    )?.ciudad;
    this.departamentoResidencia = this.usuario.direcciones.find(
      (direccion) => direccion?.tipoDireccion_id === TIPO_DIRECCION.DIRECCION_RESIDENCIAL
    )?.departamento;
    this.codigoPostalResidencia = this.usuario.direcciones.find(
      (direccion) => direccion?.tipoDireccion_id === TIPO_DIRECCION.DIRECCION_RESIDENCIAL
    )?.codigoPostal;
    this.paisResidencia = this.usuario.direcciones.find(
      (direccion) => direccion?.tipoDireccion_id === TIPO_DIRECCION.DIRECCION_RESIDENCIAL
    )?.pais;
    this.direccionPostal = this.usuario.direcciones.find(
      (direccion) => direccion?.tipoDireccion_id === TIPO_DIRECCION.DIRECCION_POSTAL
    )?.direccion;
    this.ciudadPostal = this.usuario.direcciones.find(
      (direccion) => direccion?.tipoDireccion_id === TIPO_DIRECCION.DIRECCION_POSTAL
    )?.ciudad;
    this.departamentoPostal = this.usuario.direcciones.find(
      (direccion) => direccion?.tipoDireccion_id === TIPO_DIRECCION.DIRECCION_POSTAL
    )?.departamento;
    this.codigoPostal = this.usuario.direcciones.find(
      (direccion) => direccion?.tipoDireccion_id === TIPO_DIRECCION.DIRECCION_POSTAL
    )?.codigoPostal;
    this.paisPostal = this.usuario.direcciones.find(
      (direccion) => direccion?.tipoDireccion_id === TIPO_DIRECCION.DIRECCION_POSTAL
    )?.pais;

    this.fuenteDeIngresos_id = this.usuario.usuarioFuenteIngreso ? this.usuario.usuarioFuenteIngreso : '';
    this.ingresoMensual = this.usuario.ingresoMensual ? this.usuario.ingresoMensual : '';
    this.gradoAcademico = this.usuario.gradoAcademico_id ? this.usuario.gradoAcademico_id : '';
    this.tipoEmpleo = this.usuario.tipoEmpleo_id ? this.usuario.tipoEmpleo_id : '';
    this.especializacionEmpleo = this.usuario.especializacionEmpleo ? this.usuario.especializacionEmpleo : '';

    this.tipoMiembro = this.usuario.tipoMiembro_id ? this.usuario.tipoMiembro_id : '';
    this.esjoven = this.usuario.esJoven ? this.usuario.esJoven : false;
    this.ejerMinisterio = this.usuario.usuarioMinisterio ? true : false;
    this.voluntario = true;
    this.ministerioUsuario = this.ministeriosUsuario;
    // this.voluntarioUsuario = this.usuario.usuario ? true : false;
    this.congregacionPais = this.usuario.usuarioCongregacion[0]?.congregacion
      ? this.usuario.usuarioCongregacion[0].pais_id
      : '';
    this.congreacionCiudad = this.usuario.usuarioCongregacion[0]?.congregacion
      ? this.usuario.usuarioCongregacion[0].UsuarioCongregacion?.congregacion_id
      : '';
    this.congregacionCampo = this.usuario.usuarioCongregacion[0]?.congregacion
      ? this.usuario.usuarioCongregacion[0].UsuarioCongregacion?.campo_id
      : '';
    this.vacuna = this.usuario.vacuna_id ? this.usuario?.vacuna_id : '';
    this.dosisUsuario = this.usuario?.dosis_id ? this.usuario?.dosis_id : '';
  }

  crearFormularios() {
    const controlMinisterios = this.ministerios.map((control) => this.formBuilder.control(false));

    this.registroUnoForm = this.formBuilder.group({
      fechaNacimiento: [this.fechaDeNacimiento, [Validators.required]],
      primerNombre: [this.primerNombre, [Validators.required, Validators.minLength(3)]],
      segundoNombre: [this.segundoNombre, [Validators.minLength(3)]],
      primerApellido: [this.primerApellido, [Validators.required, Validators.minLength(3)]],
      segundoApellido: [this.segundoApellio, [Validators.minLength(3)]],
      apodo: [this.apodo, [Validators.minLength(3)]],
      email: [this.email, [Validators.required, Validators.email]],
      genero_id: [this.genero_id, [Validators.required]],
      estadoCivil_id: [this.estadoCivil_id, [Validators.required]],
    });

    this.registroDosForm = this.formBuilder.group({
      nacionalidad: [this.nacionalidad, [Validators.required, Validators.minLength(3)]],
      rolCasa_id: [this.rolEnCasa, [Validators.required]],
      numeroCelular: [this.celular, [Validators.required, Validators.minLength(3)]],
      telefonoCasa: [this.telefonoCasa, [Validators.minLength(3)]],
      direccionResidencia: [this.direccionResidencia, [Validators.required, Validators.minLength(3)]],
      ciudadResidencia: [this.ciudadResidencia, [Validators.required, Validators.minLength(3)]],
      departamentoResidencia: [this.departamentoResidencia, [Validators.minLength(3)]],
      codigoPostalResidencia: [this.codigoPostalResidencia, [Validators.minLength(3)]],
      paisResidencia: [this.paisResidencia, [Validators.required, Validators.minLength(3)]],
      direccionPostal: [this.direccionPostal, [Validators.minLength(5)]],
      ciudadPostal: [this.ciudadPostal, [Validators.minLength(3)]],
      departamentoPostal: [this.departamentoPostal, [Validators.minLength(3)]],
      codigoPostal: [this.codigoPostal, [Validators.minLength(3)]],
      paisPostal: [this.paisPostal, [Validators.minLength(3)]],
    });

    this.registroTresForm = this.formBuilder.group({
      fuenteIngresos: new FormArray([]),
      ingresoMensual: [this.ingresoMensual, []],
      gradoAcademico_id: [this.gradoAcademico, [Validators.required]],
      tipoEmpleo_id: [this.tipoEmpleo, [Validators.required]],
      especializacionEmpleo: [this.especializacionEmpleo, [Validators.minLength(3)]],
    });

    this.registroCuatroForm = this.formBuilder.group({
      tipoMiembro_id: [this.tipoMiembro, [Validators.required]],
      congregacion_id: [this.congreacionCiudad, [Validators.required]],
      campo_id: [this.congregacionCampo, []],
      esJoven: [this.esjoven, [Validators.required]],
      ejerceMinisterio: [this.ejerMinisterio, [Validators.required]],
      esVoluntario: [this.voluntario, [Validators.required]],
      ministerio: this.formBuilder.array(controlMinisterios),
      voluntariado: this.formBuilder.array(controlMinisterios),
      congregacionPais_id: [this.congregacionPais, [Validators.required]],
      vacuna_id: [this.vacuna, [Validators.required]],
      dosis_id: [this.dosisUsuario, [Validators.required]],
    });
    this.patchValueMinisterios();
  }

  get ministeriosArr() {
    return this.registroCuatroForm.get('ministerio') as FormArray;
  }

  patchValueMinisterios() {
    this.ministerios.map((ministerio, i) => {
      if (this.ministerioUsuario.indexOf(ministerio.id) !== -1) {
        this.ministeriosArr.at(i)?.patchValue(true);
      }
    });
  }

  onCheckboxFuenteDeIngresosChange(event: any) {
    const selectedFuenteDeIngresos = this.registroTresForm.controls['fuenteIngresos'] as FormArray;

    if (event.target.checked) {
      selectedFuenteDeIngresos.push(new FormControl(event.target.value));
    } else {
      const index = selectedFuenteDeIngresos.controls.findIndex((x) => x.value === event.target.value);
      selectedFuenteDeIngresos.removeAt(index);
    }
  }

  onCheckboxMinisteriosChange(event: any) {
    const selectedMinisterios = this.registroCuatroForm.controls['ministerio'] as FormArray;

    if (event.target.checked) {
      selectedMinisterios.push(new FormControl(event.target.value));
    } else {
      const index = selectedMinisterios.controls.findIndex((x) => x.value === event.target.value);
      selectedMinisterios.removeAt(index);
    }
  }

  onCheckboxVoluntariadosChange(event: any) {
    const selectedVoluntariados = this.registroCuatroForm.controls['voluntariado'] as FormArray;
    if (event.target.checked) {
      selectedVoluntariados.push(new FormControl(event.target.value));
    } else {
      const index = selectedVoluntariados.controls.findIndex((x) => x.value === event.target.value);
      selectedVoluntariados.removeAt(index);
    }
  }

  ejerceAlgunMinisterio() {
    return this.registroCuatroForm.controls['ejerceMinisterio'].value || false;
  }

  esVoluntario() {
    return this.registroCuatroForm.controls['esVoluntario'].value || false;
  }

  resetFormulario() {
    this.registroUnoForm.reset();
    this.registroDosForm.reset();
    this.registroTresForm.reset();
    this.registroCuatroForm.reset();
  }

  guardarUsuario() {
    if (
      this.step == 4 &&
      this.registroUnoForm.valid &&
      this.registroDosForm.valid &&
      this.registroTresForm.valid &&
      this.registroCuatroForm.valid
    ) {
      let informacionFormulario = Object.assign(
        this.registroUnoForm.value,
        this.registroDosForm.value,
        this.registroTresForm.value,
        this.registroCuatroForm.value
      );

      const usuarioNuevo: RegisterFormInterface = {
        primerNombre: informacionFormulario.primerNombre,
        segundoNombre: informacionFormulario.segundoNombre ? informacionFormulario.segundoNombre : '',
        primerApellido: informacionFormulario.primerApellido,
        segundoApellido: informacionFormulario.segundoApellido ? informacionFormulario.segundoApellido : '',
        apodo: informacionFormulario.apodo ? informacionFormulario.apodo : '',
        nacionalidad_id: this.buscarIDNacionalidad(informacionFormulario.nacionalidad),
        email: informacionFormulario.email ? informacionFormulario.email : '',
        numeroCelular: informacionFormulario.numeroCelular?.internationalNumber,
        telefonoCasa: informacionFormulario.telefonoCasa?.internationalNumber,
        fechaNacimiento: informacionFormulario.fechaNacimiento,
        genero_id: informacionFormulario.genero_id,
        estadoCivil_id: informacionFormulario.estadoCivil_id,
        vacuna_id: informacionFormulario.vacuna_id,
        dosis_id: informacionFormulario.dosis_id,
        direcciones: [
          {
            direccion: informacionFormulario.direccionResidencia,
            ciudad: informacionFormulario.ciudadResidencia,
            departamento: informacionFormulario.departamentoResidencia,
            pais: informacionFormulario.paisResidencia,
            codigoPostal: informacionFormulario.codigoPostalResidencia,
            tipoDireccion_id: TIPO_DIRECCION.DIRECCION_RESIDENCIAL,
          },
          {
            direccion: informacionFormulario.direccionPostal,
            ciudad: informacionFormulario.ciudadPostal,
            departamento: informacionFormulario.departamentoPostal,
            pais: informacionFormulario.paisPostal,
            codigoPostal: informacionFormulario.codigoPostal,
            tipoDireccion_id: TIPO_DIRECCION.DIRECCION_POSTAL,
          },
        ],
        fuentesDeIngreso: informacionFormulario.fuenteIngresos,
        ingresoMensual: informacionFormulario.ingresoMensual,
        gradoAcademico_id: informacionFormulario.gradoAcademico_id,
        tipoEmpleo_id: informacionFormulario.tipoMiembro_id,
        especializacionEmpleo: informacionFormulario.especializacionEmpleo,
        tipoMiembro_id: informacionFormulario.tipoEmpleo_id,
        esJoven: informacionFormulario.esJoven,
        ministerios: this.ministeriosSeleccionados(),
        voluntariados: informacionFormulario.voluntariado,
        congregacion: {
          pais_id: informacionFormulario.congregacionPais_id,
          congregacion_id: informacionFormulario.congregacion_id,
          campo_id: informacionFormulario.campo_id,
        },
        rolCasa_id: informacionFormulario.rolCasa_id,
        tipoDocumento_id: informacionFormulario?.tipoDocumento_id,
        numeroDocumento: informacionFormulario.numeroDocumento ? informacionFormulario.numeroDocumento : '',
        terminos: false,
      };

      console.log('usuarioNuevo', usuarioNuevo);
      this.usuarioNuevo.emit(usuarioNuevo);
    } else {
      Swal.fire({
        title: 'El usuario NO ha sido creado',
        icon: 'error',
        html: 'Existen campos obligatorios sin llenar',
      });
    }
  }

  ministeriosSeleccionados(): number[] {
    const ministeriosSeleccionados = this.registroCuatroForm.value.ministerio
      .map((checked: any, i: number) => (checked ? this.ministerios[i].id : null))
      .filter((value: any) => value !== null);
    return ministeriosSeleccionados;
  }

  listarCongregaciones(pais: string) {
    this.congregacionesFiltradas = this.congregaciones.filter(
      (congregacionBuscar) => congregacionBuscar.pais_id === parseInt(pais)
    );
  }

  listarCampos(congregacion: string) {
    this.camposFiltrados = this.campos.filter(
      (campoABuscar) => campoABuscar.congregacion_id === parseInt(congregacion)
    );
  }

  buscarNacionalidad(formControlName: string) {
    this.letrasFiltrarNacionalidad = this.registroDosForm.get(formControlName.toString()).valueChanges.pipe(
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

  buscarIDNacionalidad(nacionalidad: string): number {
    return this.nacionalidades.find((nacionalidades: NacionalidadModel) => nacionalidades.nombre == nacionalidad).id;
  }

  buscarCorreo(email: string) {
    this.mensajeBuscarCorreo = '';
    this.buscarCorreoSubscription = this.buscarCorreoService.buscarCorreoUsuario(email).subscribe((respuesta: any) => {
      if (!respuesta.ok) {
        this.mensajeBuscarCorreo = respuesta.msg;
      }
    });
  }

  tieneTipoDocumento(idPais: string): number {
    this.tipoDeDocumentosFiltrados = [];
    this.tipoDeDocumentosFiltrados = this.tiposDeDocumentos.filter(
      (tipoDocumento: TipoDocumentoModel) => tipoDocumento.pais_id === Number(idPais)
    );
    if (this.tipoDeDocumentosFiltrados.length > 0) {
      this.agregarControlTipoDocumento();
    } else {
      this.eliminarControlTipoDocumento();
    }
    return this.tipoDeDocumentosFiltrados.length;
  }

  agregarControlTipoDocumento() {
    this.registroCuatroForm = this.formBuilder.group({
      ...this.registroCuatroForm.controls,
      tipoDocumento_id: ['', Validators.required],
      numeroDocumento: ['123456', Validators.required],
    });
    return true;
  }

  eliminarControlTipoDocumento() {
    this.registroCuatroForm.removeControl('tipoDocumento_id');
    this.registroCuatroForm.removeControl('numeroDocumento');

    return true;
  }

  buscarCongregacion(idCongregacion: number): string {
    const congregacion = this.congregaciones.find((congregacion) => congregacion.id === idCongregacion);

    return congregacion.congregacion;
  }

  buscarCongregacionPais(idPais: number): string {
    const congregacionPais = this.paises.find((pais) => pais.id === idPais);

    return congregacionPais.pais;
  }

  next() {
    if (this.step == 1) {
      this.registroUno_step = true;
      if (this.registroUnoForm.invalid) {
        return;
      }
      this.step++;
      return;
    }
    if (this.step == 2) {
      this.registroDos_step = true;
      if (this.registroDosForm.invalid) {
        return;
      }
      this.step++;
      return;
    }
    if (this.step == 3) {
      this.registroTres_step = true;
      if (this.registroTresForm.invalid) {
        return;
      }
      this.step++;
    }
  }

  previous() {
    this.step--;
    if (this.step == 1) {
      this.registroUno_step = false;
    }
    if (this.step == 2) {
      this.registroDos_step = false;
    }
    if (this.step == 3) {
      this.registroTres_step = false;
    }
  }
}
