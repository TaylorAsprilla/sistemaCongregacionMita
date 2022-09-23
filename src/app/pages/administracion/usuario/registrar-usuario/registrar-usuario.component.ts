import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { TipoDocumentoModel } from 'src/app/core/models/tipo-documento.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { VacunaModel } from 'src/app/core/models/vacuna.model';
import { Rutas } from 'src/app/routes/menu-items';
import { CampoService } from 'src/app/services/campo/campo.service';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { DosisService } from 'src/app/services/dosis/dosis.service';
import { EstadoCivilService } from 'src/app/services/estado-civil/estado-civil.service';
import { GeneroService } from 'src/app/services/genero/genero.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import { RolCasaService } from 'src/app/services/rol-casa/rol-casa.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento/tipo-documento.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { VacunaService } from 'src/app/services/vacuna/vacuna.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

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
  public step = 1;

  currentDate = moment();

  public usuarios: UsuarioModel[] = [];
  public tipoDocumentos: TipoDocumentoModel[] = [];
  public generos: GeneroModel[] = [];
  public estadoCivil: EstadoCivilModel[] = [];
  public rolCasa: RolCasaModel[] = [];
  public paises: PaisModel[] = [];
  public congregaciones: CongregacionModel[] = [];
  public campos: CampoModel[] = [];
  public vacunas: VacunaModel[] = [];
  public dosis: DosisModel[] = [];
  public nacionalidades: NacionalidadModel[] = [];
  public congregacionesFiltradas: CongregacionModel[] = [];
  public camposFiltrados: CampoModel[] = [];

  public usuarioSeleccionado: UsuarioModel;

  // Subscription
  public usuarioSubscription: Subscription;
  public tipoDocumentoSubscription: Subscription;
  public generoSubscription: Subscription;
  public estadoCivilSubscription: Subscription;
  public rolCasaSubscription: Subscription;
  public paisSubscription: Subscription;
  public congregacionSubscription: Subscription;
  public campoSubscription: Subscription;
  public vacunaSubscription: Subscription;
  public dosisSubscription: Subscription;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.PuertoRico,
    CountryISO.Colombia,
    CountryISO.DominicanRepublic,
    CountryISO.Ecuador,
    CountryISO.Mexico,
    CountryISO.UnitedStates,
    CountryISO.Venezuela,
  ];

  filteredOptions: Observable<NacionalidadModel[]>;
  myControl = new FormControl('');

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private tipoDocumentoService: TipoDocumentoService,
    private generoService: GeneroService,
    private estadoCivilService: EstadoCivilService,
    private rolCasaService: RolCasaService,
    private paisService: PaisService,
    private congregacionService: CongregacionService,
    private campoService: CampoService,
    private vacunaService: VacunaService,
    private dosisService: DosisService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.buscarUsuario(id);
    });

    this.activatedRoute.data.subscribe((data: { nacionalidad: NacionalidadModel[] }) => {
      this.nacionalidades = data.nacionalidad;
    });

    this.registroUnoForm = this.formBuilder.group({
      fechaNacimiento: ['2022-07-27', [Validators.required]],
      primerNombre: ['Taylor', [Validators.required, Validators.minLength(3)]],
      segundoNombre: ['Alirio', [Validators.minLength(3)]],
      primerApellido: ['Asprilla', [Validators.required, Validators.minLength(3)]],
      segundoApellido: ['Bohórquez', [Validators.minLength(3)]],
      apodo: ['Tay', [Validators.minLength(3)]],
      email: ['taylor.asprilla@gmail.com', [Validators.email]],
      genero_id: ['1', [Validators.required]],
      estadoCivil_id: ['1', [Validators.required]],
    });

    this.registroDosForm = this.formBuilder.group({
      nacionalidad_id: ['Colombia', [Validators.required]],
      rolCasa_id: ['1', [Validators.required]],
      numeroCelular: [{}, [Validators.minLength(7)]],
      telefonoCasa: [{}, [Validators.minLength(3)]],
      direccion: ['Calle 12 # 17 - 34', [Validators.required, Validators.minLength(5)]],
      ciudad: ['Bogotá', [Validators.required, Validators.minLength(5)]],
      departamento: ['Cundinamarca', [Validators.minLength(5)]],
      codigoPostal: ['', [Validators.minLength(3)]],
      pais_id: ['Colombia', [Validators.required]],
    });

    this.registroTresForm = this.formBuilder.group({
      fuenteIngresos: ['1', [Validators.required]],
      ingresoMensual: ['1250000', []],
      gradoAcademico_id: ['2', []],
      tipoEmpleo_id: ['11', []],
      especializacionEmpleo: ['Ingeniero', []],
    });

    this.registroCuatroForm = this.formBuilder.group({
      tipomiembreo_id: ['1', [Validators.required]],
      esJoven: ['1250000', []],
      ministerio: ['2', []],
      voluntario: ['11', []],
    });

    this.usuarioForm = this.formBuilder.group({
      primerNombre: ['', [Validators.required, Validators.minLength(3)]],
      segundoNombre: ['', [Validators.minLength(3)]],
      primerApellido: ['', [Validators.required, Validators.minLength(3)]],
      segundoApellido: ['', [Validators.minLength(3)]],
      numeroDocumento: ['', [Validators.minLength(3)]],
      fechaNacimiento: ['', [Validators.required]],
      email: ['', [Validators.email]],
      telefonoCasa: ['', [Validators.minLength(3)]],
      numeroCelular: ['', [Validators.minLength(7)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      zipCode: ['', [Validators.minLength(3)]],
      foto: ['', []],
      genero_id: ['', [Validators.required]],
      tipoDocumento_id: ['', [Validators.required]],
      pais_id: ['', [Validators.required]],
      congregacion_id: ['1', [Validators.required]],
      campo_id: ['', [Validators.required]],
      estadoCivil_id: ['', [Validators.required]],
      rolCasa_id: ['', [Validators.required]],
      vacuna_id: ['', [Validators.required]],
      dosis_id: ['', [Validators.required]],
      nacionalidad_id: ['', [Validators.required]],
      login: ['', []],
      password: ['', []],
    });

    this.usuarioSubscription = this.usuarioService.listarTodosLosUsuarios().subscribe(({ totalUsuarios, usuarios }) => {
      this.usuarios = usuarios;
    });

    this.tipoDocumentoSubscription = this.tipoDocumentoService
      .listarTipoDocumentos()
      .subscribe((tipoDocumento: TipoDocumentoModel[]) => {
        this.tipoDocumentos = tipoDocumento;
      });

    this.generoSubscription = this.generoService.listarGeneros().subscribe((genero: GeneroModel[]) => {
      this.generos = genero;
    });

    this.estadoCivilSubscription = this.estadoCivilService
      .listarEstadoCivil()
      .subscribe((estadoCivil: EstadoCivilModel[]) => {
        this.estadoCivil = estadoCivil;
      });

    this.rolCasaSubscription = this.rolCasaService.listarRolCasa().subscribe((rolCasa: RolCasaModel[]) => {
      this.rolCasa = rolCasa;
    });

    this.paisSubscription = this.paisService.getPaises().subscribe((pais: PaisModel[]) => {
      this.paises = pais;
    });

    this.congregacionSubscription = this.congregacionService
      .getCongregaciones()
      .subscribe((congregaciones: CongregacionModel[]) => {
        this.congregaciones = congregaciones.filter((congregacion) => congregacion.estado === true);
      });

    this.campoSubscription = this.campoService.listarCampo().subscribe((campos: CampoModel[]) => {
      this.campos = campos.filter((campo) => campo.estado === true);
    });

    this.vacunaSubscription = this.vacunaService.listarVacuna().subscribe((vacuna: VacunaModel[]) => {
      this.vacunas = vacuna;
    });

    this.dosisSubscription = this.dosisService.listarDosis().subscribe((dosis: DosisModel[]) => {
      this.dosis = dosis;
    });

    this.buscarNacionalidad();
  }

  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
    this.tipoDocumentoSubscription?.unsubscribe();
    this.generoSubscription?.unsubscribe();
    this.estadoCivilSubscription?.unsubscribe();
    this.rolCasaSubscription?.unsubscribe();
    this.paisSubscription?.unsubscribe();
    this.congregacionSubscription?.unsubscribe();
    this.campoSubscription?.unsubscribe();
    this.vacunaSubscription?.unsubscribe();
    this.dosisSubscription?.unsubscribe();
  }

  guardarUsuario() {
    const usuarioNuevo = this.usuarioForm.value;

    this.usuarioService.crearUsuario(usuarioNuevo).subscribe(
      (usuarioCreado: any) => {
        Swal.fire('Usuario creado', 'correctamente', 'success');
        this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.USUARIOS}`);
      },
      (error) => {
        let errores = error.error.errors;
        let listaErrores = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Usuario creado',
          icon: 'error',
          html: `${listaErrores.join('')}`,
        });
      }
    );
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
              numeroDocumento,
              telefonoCasa,

              login,
              password,
              foto,
              tipoDocumento_id,
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
              numeroDocumento,
              telefonoCasa,

              login,
              password,
              foto,
              tipoDocumento_id,
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

  resetFormulario() {
    this.usuarioForm.reset();
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

  buscarNacionalidad() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
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

  next() {
    console.log('Entró');
    if (this.step == 1) {
      this.registroUno_step = true;
      if (this.registroUnoForm.invalid) {
        return;
      }
      this.step++;
      return;
    }
    if (this.step == 2) {
      console.log('this.step ', this.step);
      this.registroDos_step = true;
      if (this.registroDosForm.invalid) {
        console.log('this.registroDosForm', this.registroDosForm);
        return;
      }
      this.step++;
      return;
    }
    if (this.step == 3) {
      console.log('this.step ', this.step);
      this.registroTres_step = true;
      if (this.registroTresForm.invalid) {
        console.log('this.registroDosForm', this.registroDosForm);
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
