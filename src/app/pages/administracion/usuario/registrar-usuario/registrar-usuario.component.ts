import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Observable, Subscription } from 'rxjs';
import { delay, map, startWith } from 'rxjs/operators';
import { UsuarioInterface } from 'src/app/core/interfaces/usuario.interface';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { DosisModel } from 'src/app/core/models/dosis.model';
import { EstadoCivilModel } from 'src/app/core/models/estado-civil.model';
import { GeneroModel } from 'src/app/core/models/genero.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { PaisModel } from 'src/app/core/models/pais.model';
import { RolCasaModel } from 'src/app/core/models/rol-casa.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { VacunaModel } from 'src/app/core/models/vacuna.model';
import { Rutas } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { FuenteIngresoModel } from 'src/app/core/models/fuente-ingreso.model';
import { GradoAcademicoModel } from 'src/app/core/models/grado-academico.model';
import { TipoEmpleoModel } from 'src/app/core/models/tipo-empleo.model';
import { TipoMiembroModel } from 'src/app/core/models/tipo.miembro.model';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';
import { VoluntariadoModel } from 'src/app/core/models/voluntariado.model';
import { RegisterFormInterface, TIPO_DIRECCION } from 'src/app/core/interfaces/register-form.interface';
import { BuscarCorreoService } from 'src/app/services/buscar-correo/buscar-correo.service';
import { BuscarCelularService } from 'src/app/services/buscar-celular/buscar-celular.service';
import config from 'src/environments/config/config';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.scss'],
})
export class RegistrarUsuarioComponent implements OnInit, OnDestroy {
  public usuarioForm: FormGroup;
  public registroUnoForm!: FormGroup;
  public registroDosForm!: FormGroup;
  public registroTresForm!: FormGroup;
  public registroCuatroForm!: FormGroup;

  public registroUno_step = false;
  public registroDos_step = false;
  public registroTres_step = false;
  public step: number = 1;

  currentDate = moment();

  public usuarios: UsuarioModel[] = [];
  public generos: GeneroModel[] = [];
  public estadoCivil: EstadoCivilModel[] = [];
  public rolCasa: RolCasaModel[] = [];
  public paises: PaisModel[] = [];
  public congregaciones: CongregacionModel[] = [];
  public campos: CampoModel[] = [];
  public vacunas: VacunaModel[] = [];
  public dosis: DosisModel[] = [];
  public nacionalidades: NacionalidadModel[] = [];
  public fuenteDeIngresos: FuenteIngresoModel[] = [];
  public gradosAcademicos: GradoAcademicoModel[] = [];
  public tiposEmpleos: TipoEmpleoModel[] = [];
  public tipoMiembros: TipoMiembroModel[] = [];
  public ministerios: MinisterioModel[] = [];
  public voluntariados: VoluntariadoModel[] = [];

  public congregacionesFiltradas: CongregacionModel[] = [];
  public camposFiltrados: CampoModel[] = [];

  public usuarioSeleccionado: UsuarioModel;

  public mensajeBuscarCorreo: string = '';
  public sinCongregacion: number;
  public sinCampo: number;

  // Subscription
  public usuarioSubscription: Subscription;
  public buscarCorreoSubscription: Subscription;
  public buscarCelularSubscription: Subscription;

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

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private buscarCorreoService: BuscarCorreoService
  ) {}

  ngOnInit(): void {
    this.sinCongregacion = config.sinCongregacion;

    this.activatedRoute.params.subscribe(({ id }) => {
      this.buscarUsuario(id);
    });

    this.activatedRoute.data.subscribe(
      (data: {
        nacionalidad: NacionalidadModel[];
        estadoCivil: EstadoCivilModel[];
        rolCasa: RolCasaModel[];
        genero: GeneroModel[];
        fuenteDeIngreso: FuenteIngresoModel[];
        gradoAcademico: GradoAcademicoModel[];
        tipoEmpleo: TipoEmpleoModel[];
        congregacion: CongregacionModel[];
        tipoMiembro: TipoMiembroModel[];
        ministerio: MinisterioModel[];
        voluntariado: VoluntariadoModel[];
        pais: PaisModel[];
        campo: CampoModel[];

        vacuna: VacunaModel[];
        dosis: DosisModel[];
      }) => {
        this.nacionalidades = data.nacionalidad;
        this.estadoCivil = data.estadoCivil;
        this.rolCasa = data.rolCasa;
        this.generos = data.genero;
        this.fuenteDeIngresos = data.fuenteDeIngreso;
        this.gradosAcademicos = data.gradoAcademico;
        this.tiposEmpleos = data.tipoEmpleo;
        this.tipoMiembros = data.tipoMiembro;
        this.congregaciones = data.congregacion.filter((congregacion) => congregacion.estado === true);
        this.ministerios = data.ministerio.filter((ministerio) => ministerio.estado === true);
        this.voluntariados = data.voluntariado;
        this.paises = data.pais.filter((pais) => pais.estado === true);
        this.campos = data.campo.filter((campo) => campo.estado === true);
        this.vacunas = data.vacuna;
        this.dosis = data.dosis;
      }
    );

    this.usuarioSubscription = this.usuarioService.listarTodosLosUsuarios().subscribe(({ totalUsuarios, usuarios }) => {
      this.usuarios = usuarios;
    });

    this.crearFormularios();
  }

  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
    this.buscarCelularSubscription?.unsubscribe();
    this.buscarCorreoSubscription?.unsubscribe();
  }

  crearFormularios() {
    this.registroUnoForm = this.formBuilder.group({
      fechaNacimiento: ['1989-01-01', [Validators.required]],
      primerNombre: ['Maria', [Validators.required, Validators.minLength(3)]],
      segundoNombre: ['Juliana', [Validators.minLength(3)]],
      primerApellido: ['Mosquera', [Validators.required, Validators.minLength(3)]],
      segundoApellido: ['Martinez', [Validators.minLength(3)]],
      apodo: ['Julianita', [Validators.minLength(3)]],
      email: ['juliana@gmail.com', [Validators.required, Validators.email]],
      genero_id: ['1', [Validators.required]],
      estadoCivil_id: ['1', [Validators.required]],
    });

    this.registroDosForm = this.formBuilder.group({
      nacionalidad: ['Colombia', [Validators.required, Validators.minLength(3)]],
      rolCasa_id: ['1', [Validators.required]],
      numeroCelular: ['', [Validators.required, Validators.minLength(3)]],
      telefonoCasa: ['+6012035614', [Validators.minLength(3)]],
      direccionResidencia: ['Calle 13 # 14 10', [Validators.required, Validators.minLength(3)]],
      ciudadResidencia: ['Bogotá', [Validators.required, Validators.minLength(3)]],
      departamentoResidencia: ['Cundinamarca', [Validators.minLength(3)]],
      codigoPostalResidencia: ['789456', [Validators.minLength(3)]],
      paisResidencia: ['Colombia', [Validators.required, Validators.minLength(3)]],
      direccionPostal: ['Calle 14 # 45 78', [Validators.minLength(5)]],
      ciudadPostal: ['Bogotá', [Validators.minLength(3)]],
      departamentoPostal: ['Cundinamarca', [Validators.minLength(3)]],
      codigoPostal: ['789456', [Validators.minLength(3)]],
      paisPostal: ['Colombia', [Validators.minLength(3)]],
    });

    this.registroTresForm = this.formBuilder.group({
      fuenteIngresos: new FormArray([]),
      ingresoMensual: ['', []],
      gradoAcademico_id: ['', [Validators.required]],
      tipoEmpleo_id: ['', [Validators.required]],
      especializacionEmpleo: ['', [Validators.minLength(3)]],
    });

    this.registroCuatroForm = this.formBuilder.group({
      tipoMiembro_id: ['', [Validators.required]],
      congregacion_id: ['', [Validators.required]],
      campo_id: ['', []],
      esJoven: ['', [Validators.required]],
      ejerceMinisterio: ['', [Validators.required]],
      esVoluntario: ['', [Validators.required]],
      ministerio: new FormArray([]),
      voluntariado: new FormArray([]),
      congregacionPais_id: ['', [Validators.required]],
      vacuna_id: ['', [Validators.required]],
      dosis_id: ['', [Validators.required]],
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
        ministerios: informacionFormulario.ministerio,
        voluntariados: informacionFormulario.voluntariado,
        congregacion: {
          pais_id: informacionFormulario.congregacionPais_id,
          congregacion_id: informacionFormulario.congregacion_id,
          campo_id: informacionFormulario.campo_id,
        },
        terminos: false,
        rolCasa_id: informacionFormulario.rolCasa_id,
      };

      this.usuarioService.crearUsuario(usuarioNuevo).subscribe(
        (usuarioCreado: any) => {
          Swal.fire('Usuario creado', 'correctamente', 'success');

          this.router.navigateByUrl(
            `${Rutas.SISTEMA}/${Rutas.CONFIRMAR_REGISTRO}/${usuarioCreado.usuarioNuevo.usuario.id}`
          );
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
            title: 'El usuario NO ha sido creado',
            icon: 'error',
            html: listaErrores.join('') ? `${listaErrores.join('')}` : error.error.msg,
          });
        }
      );
    } else {
      Swal.fire({
        title: 'El usuario NO ha sido creado',
        icon: 'error',
        html: 'Existen campos obligatorios sin llenar',
      });
    }
  }

  buscarUsuario(id: string) {
    if (id !== 'nuevo') {
      this.usuarioService
        .getUsuario(Number(id))
        .pipe(delay(100))
        .subscribe(
          (usuarioEncontrado: UsuarioInterface) => {
            console.info(usuarioEncontrado);
            const {
              primerNombre,
              primerApellido,
              email,
              numeroCelular,
              fechaNacimiento,
              genero_id,
              estadoCivil_id,
              vacuna_id,
              dosis_id,
              segundoNombre,
              segundoApellido,
              telefonoCasa,
              login,
              password,
              foto,
              rolCasa_id,
              nacionalidad_id,
            } = usuarioEncontrado.usuario;
            this.usuarioSeleccionado = usuarioEncontrado.usuario;

            const { pais_id, congregacion_id, campo_id } = usuarioEncontrado.usuarioCongregacion;

            this.usuarioForm.setValue({
              primerNombre,
              primerApellido,
              email,
              numeroCelular,
              fechaNacimiento,
              genero_id,
              pais_id,
              congregacion_id,
              campo_id,
              estadoCivil_id,
              vacuna_id,
              dosis_id,
              segundoNombre,
              segundoApellido,
              telefonoCasa,
              login,
              password,
              foto,
              rolCasa_id,
              nacionalidad_id,
            });
          },
          (error) => {
            let errores = error.error.errors;
            let listaErrores = [];

            Object.entries(errores).forEach(([key, value]) => {
              listaErrores.push('° ' + value['msg'] + '<br>');
            });

            Swal.fire({
              title: 'Usuario',
              icon: 'error',
              html: `${listaErrores.join('')}`,
            });

            return this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.USUARIOS}`);
          }
        );
    }
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
    this.buscarCorreoSubscription = this.buscarCorreoService.buscarCorreo(email).subscribe((respuesta: any) => {
      if (!respuesta.ok) {
        this.mensajeBuscarCorreo = respuesta.msg;
      }
    });
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
      console.log('this.registroDosForm', this.registroDosForm);
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
