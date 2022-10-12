import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SolicitudMultimediaModel } from 'src/app/core/models/acceso-multimedia.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { FamiliarModel } from 'src/app/core/models/familiar.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { PaisModel } from 'src/app/core/models/pais.model';
import { ParentescoModel } from 'src/app/core/models/parentesco.model';
import { RazonSolicitudModel } from 'src/app/core/models/razon-solicitud.model';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private solicitudMultimediaService: SolicitudMultimediaService
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
      nombre: ['Christian Guti Comba', [Validators.required, Validators.minLength(3)]],
      direccion: ['Calle 23 # 4567 Piso 4', [Validators.required, Validators.minLength(3)]],
      ciudad: ['Ciudad de Mexico', [Validators.required, Validators.minLength(3)]],
      departamento: ['Mexico', [Validators.minLength(3)]],
      codigoPostal: ['1245656', [Validators.minLength(3)]],
      pais: ['Mexico', [Validators.required, Validators.minLength(3)]],
      telefono: ['+57 601235614', [Validators.minLength(3)]],
      celular: ['+57 311887332', { updateOn: 'blur' }, [Validators.required, Validators.minLength(3)]],
      email: ['christian@gmail.com', [Validators.required, Validators.minLength(3), Validators.email]],
      miembroCongregacion: ['1', [Validators.required]],
      congregacionCercana: ['Bogotá', [Validators.minLength(3)]],
      distancia: ['02:24', [Validators.minLength(3)]],
      familiaEnPR: ['1', [Validators.required]],
      razonSolicitud_id: ['1', []],
      otraRazonSolicitud: ['No puedo ir', []],
      nacionalidad: ['Colombia', [Validators.required, Validators.minLength(3)]],
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

  buscarIDNacionalidad(nacionalidad: string): number {
    return this.nacionalidades.find((nacionalidades: NacionalidadModel) => nacionalidades.nombre === nacionalidad).id;
  }

  crearSolicitud(valoresFamiliares: FamiliarModel[]) {
    const formFamiliares = valoresFamiliares['familiares'];
    const formSolicitud = this.solicitudForm.value;
    console.log('formSolicitud', formSolicitud);

    const solicitudNueva: SolicitudMultimediaModel = {
      nombre: formSolicitud.nombre,
      direccion: formSolicitud.direccion,
      ciudad: formSolicitud.ciudad,
      departamento: formSolicitud.departamento,
      codigoPostal: formSolicitud.codigoPostal,
      pais: formSolicitud.pais,
      telefono: formSolicitud.telefono.internationalNumber,
      celular: formSolicitud.celular.internationalNumber,
      email: formSolicitud.email,
      miembroCongregacion: formSolicitud.miembroCongregacion,
      congregacionCercana: formSolicitud.congregacionCercana,
      distancia: formSolicitud.distancia,
      familiaEnPR: formSolicitud.familiaEnPR,
      razonSolicitud_id: formSolicitud.razonSolicitud_id,
      nacionalidad_id: this.buscarIDNacionalidad(formSolicitud.nacionalidad),
      familiares: formFamiliares,
      id: 0,
      estado: true,
      status: false,
    };

    console.log('solicitudNueva', solicitudNueva);

    this.solicitudMultimediaService.crearSolicitudMultimedia(solicitudNueva).subscribe((respuesta: any) => {
      console.log(respuesta);
    });
  }
}
