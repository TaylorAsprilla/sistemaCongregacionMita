import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import Swal from 'sweetalert2';
import { generate } from 'generate-password-browser';

@Component({
  selector: 'app-crear-congregacion',
  templateUrl: './crear-congregacion.component.html',
  styleUrls: ['./crear-congregacion.component.scss'],
})
export class CrearCongregacionComponent implements OnInit {
  public congregacionForm: UntypedFormGroup;

  public congregaciones: CongregacionModel[] = [];
  public paises: CongregacionPaisModel[] = [];

  public obreros: UsuarioModel[] = [];

  public congregacionSeleccionada: CongregacionModel;

  // Subscription
  public congregacionSubscription: Subscription;
  public paisSubscription: Subscription;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private congregacionService: CongregacionService,
    private paisService: PaisService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.buscarCongregacion(id);
    });

    this.activatedRoute.data.subscribe((data: { obrero: UsuarioModel[] }) => {
      this.obreros = data.obrero;
    });

    this.congregacionForm = this.formBuilder.group({
      congregacion: ['', [Validators.required, Validators.minLength(3)]],
      pais_id: ['', [Validators.required]],
      idObreroEncargado: ['', [Validators.required]],
      email: ['', []],
      password: [{ value: '' }, [Validators.required]],
    });

    this.paisSubscription = this.paisService.getPaises().subscribe((pais) => {
      this.paises = pais.filter((pais: CongregacionPaisModel) => pais.estado === true);
    });

    this.cargarCongregaciones();
  }

  ngOnDestroy(): void {
    this.paisSubscription?.unsubscribe();
    this.congregacionSubscription?.unsubscribe();
  }

  cargarCongregaciones() {
    this.congregacionSubscription = this.congregacionService
      .getCongregaciones()
      .subscribe((congregacion: CongregacionModel[]) => {
        this.congregaciones = congregacion.filter((congregacion) => congregacion.estado === true);
      });
  }

  crearCongregacion() {
    const congregacionNueva = this.congregacionForm.value;

    if (congregacionNueva.idObreroEncargado === 'null') {
      delete congregacionNueva.idObreroEncargado;
    }

    if (this.congregacionSeleccionada) {
      const data: CongregacionModel = {
        ...this.congregacionForm.value,

        id: this.congregacionSeleccionada.id,
      };

      this.congregacionService.actualizarCongregacion(data).subscribe((congregacion: any) => {
        Swal.fire({
          title: 'Congregación Actualizada',
          icon: 'success',
          html: `La congregación ${congregacion.congregacionActualizada.congregacion} se actualizó correctamente`,
        });
      });

      this.resetFormulario();
      this.cargarCongregaciones();
    } else {
      this.congregacionService.crearCongregacion(congregacionNueva).subscribe(
        (congregacionCreado: any) => {
          Swal.fire({
            title: 'Congregación creada',
            html: `La congregación ${congregacionCreado.congregacion.congregacion} se creó correctamente`,
            icon: 'success',
          });

          this.resetFormulario();
          this.cargarCongregaciones();
        },
        (error) => {
          let errores = error.error.errors;
          let listaErrores = [];

          Object.entries(errores).forEach(([key, value]) => {
            listaErrores.push('° ' + value['msg'] + '<br>');
          });

          Swal.fire({
            title: 'Error al crear congregacion',
            icon: 'error',
            html: `${listaErrores.join('')}`,
          });
        }
      );
    }
  }

  buscarCongregacion(id: string) {
    if (id !== 'nuevo') {
      this.congregacionService.getCongregacion(Number(id)).subscribe(
        (congregacionEncontrada: CongregacionModel) => {
          const { congregacion, pais_id, idObreroEncargado, email, password } = congregacionEncontrada;
          this.congregacionSeleccionada = congregacionEncontrada;

          this.congregacionForm.setValue({
            congregacion,
            pais_id,
            idObreroEncargado,
            email,
            password: password ?? this.generarPassword(),
          });
        },
        (error) => {
          let errores = error.error.errors;
          let listaErrores = [];

          Object.entries(errores).forEach(([key, value]) => {
            listaErrores.push('° ' + value['msg'] + '<br>');
          });

          Swal.fire({
            title: 'Congregacion',
            icon: 'error',
            html: `${listaErrores.join('')}`,
          });

          return this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.CONGREGACIONES}`);
        }
      );
    }
  }

  generarPassword() {
    const password = generate({
      length: 10,
      numbers: true,
    });

    return password;
  }

  resetFormulario() {
    this.congregacionForm.reset();
  }
}
