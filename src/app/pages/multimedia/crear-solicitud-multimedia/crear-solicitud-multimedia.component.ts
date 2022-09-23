import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CongregacionModel } from 'src/app/models/congregacion.model';
import { NacionalidadModel } from 'src/app/models/nacionalidad.model';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { PaisService } from 'src/app/services/pais/pais.service';

@Component({
  selector: 'app-crear-solicitud-multimedia',
  templateUrl: './crear-solicitud-multimedia.component.html',
  styleUrls: ['./crear-solicitud-multimedia.component.scss'],
})
export class CrearSolicitudMultimediaComponent implements OnInit {
  public solicitudForm: FormGroup;

  // public congregaciones: CongregacionModel[] = [];
  public nacionalidades: NacionalidadModel[] = [];
  public congregaciones: CongregacionModel[] = [];

  // Subscription
  public solicitadSubscription: Subscription;
  public congregacionSubscription: Subscription;

  filteredOptions: Observable<NacionalidadModel[]>;
  myControl = new FormControl('');

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private paisService: PaisService,
    private congregacionService: CongregacionService
  ) {}

  ngOnInit(): void {
    //   this.activateRouter.params.subscribe(({ id }) => {
    //     this.buscarCongregacion(id);
    // }
    this.activatedRoute.data.subscribe((data: { nacionalidad: NacionalidadModel[] }) => {
      this.nacionalidades = data.nacionalidad;
    });

    this.solicitudForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      departamento: ['', []],
      codigoPostal: ['', []],
      telefono: ['', []],
      celular: ['', [Validators.required]],
      email: ['', [Validators.required]],
      miembroCongregacion: ['', [Validators.required]],
      distancia: ['', []],
      familiaEnPR: ['', []],
      login: ['', []],
      pais_id: ['', [Validators.required]],
      familia_id: ['', []],
      aprobacion_id: ['', []],
      razonSolicitud_id: ['', [Validators.required]],
      congregacion_id: ['', [Validators.required]],
      congregacionCercana_id: ['', [Validators.required]],
      nacionalidad_id: ['', [Validators.required]],
    });

    this.congregacionSubscription = this.congregacionService
      .getCongregaciones()
      .subscribe((congregaciones: CongregacionModel[]) => {
        this.congregaciones = congregaciones.filter((congregacion) => congregacion.estado === true);
      });
    this.buscarNacionalidad();
  }

  ngOnDestroy(): void {
    this.congregacionSubscription?.unsubscribe();
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
}
