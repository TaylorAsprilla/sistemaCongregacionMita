import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { PaisModel } from 'src/app/core/models/pais.model';
import { ParentescoModel } from 'src/app/core/models/parentesco.model';
import { RazonSolicitudModel } from 'src/app/core/models/razon-solicitud.model';

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
  public parentescos: ParentescoModel[] = [];

  // Subscription

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

  constructor(private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) {}

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
        parentesco: ParentescoModel[];
      }) => {
        this.nacionalidades = data.nacionalidad;
        this.congregaciones = data.congregacion;
        this.paises = data.pais;
        this.razonSolicitudes = data.razonSolicitud;
        this.parentescos = data.parentesco;
      }
    );

    this.crearFormularioDeLaSolicitud();
  }

  ngOnDestroy(): void {}

  crearFormularioDeLaSolicitud() {
    this.solicitudForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', [Validators.required, Validators.minLength(3)]],
      ciudad: ['', [Validators.required, Validators.minLength(3)]],
      departamento: ['', [Validators.minLength(3)]],
      codigoPostal: ['', [Validators.minLength(3)]],
      pais: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.minLength(3)]],
      celular: ['', { updateOn: 'blur' }, [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
      miembroCongregacion: ['', [Validators.required]],
      congregacionCercana: ['', [Validators.minLength(3)]],
      distancia: ['', [Validators.minLength(3)]],
      familiaEnPR: ['', [Validators.required]],
      razonSolicitud_id: ['', []],
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

  tieneFamiliaresEnPR() {
    return this.solicitudForm.controls['familiaEnPR'].value || false;
  }

  crearSolicitud() {
    const solicitudNueva = this.solicitudForm.value;
  }
}
