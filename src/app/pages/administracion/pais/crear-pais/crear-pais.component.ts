import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DivisaModel } from 'src/app/core/models/divisa.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioInterface } from 'src/app/core/interfaces/usuario.interface';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { DivisaService } from 'src/app/services/divisa/divisa.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { ObreroInterface } from 'src/app/core/models/obrero.model';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-pais',
  templateUrl: './crear-pais.component.html',
  styleUrls: ['./crear-pais.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxIntlTelInputModule],
})
export class CrearPaisComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private paisService = inject(PaisService);
  private divisaService = inject(DivisaService);
  public usuarioService = inject(UsuarioService);
  private activatedRoute = inject(ActivatedRoute);

  public paisForm: FormGroup;

  public paises: CongregacionPaisModel[] = [];
  public divisas: DivisaModel[] = [];
  public obreros: ObreroInterface[] = [];

  public paisSeleccionado: CongregacionPaisModel;
  public administradorEncontrado: UsuarioModel | null = null;
  public buscandoAdministrador = false;
  public errorBusquedaAdministrador = false;

  // Subscription
  public paisSubscription: Subscription;
  public divisaSubscription: Subscription;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.buscarPais(id);
    });

    this.activatedRoute.data.subscribe((data: any) => {
      this.obreros = data.obrero;
    });

    this.divisaSubscription = this.divisaService.listarDivisa().subscribe((divisa) => {
      this.divisas = divisa;
    });

    this.cargarPaises();
    this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.divisaSubscription?.unsubscribe();
    this.paisSubscription?.unsubscribe();
  }

  crearFormulario() {
    this.paisForm = this.formBuilder.group({
      pais: ['', [Validators.required, Validators.minLength(3)]],
      idDivisa: [null, [Validators.required]],
      idObreroEncargado: [null],
      idAdministrador: [null],
    });
  }

  cargarPaises() {
    // Si es ADMINISTRADOR_PAIS, solo cargar su país asignado
    if (this.usuarioService.isAdministradorPais) {
      const idUsuario = this.usuarioService.usuario.id;
      this.paisSubscription = this.paisService.getPaisPorAdministrador(idUsuario).subscribe(
        (pais: CongregacionPaisModel) => {
          // Convertir el país único en un array
          this.paises = pais && pais.estado ? [pais] : [];
        },
        (error) => {
          console.error('Error al cargar país del administrador:', error);
          this.paises = [];
        },
      );
    } else {
      // Para otros roles, cargar todos los países activos
      this.paisSubscription = this.paisService.getPaises().subscribe((pais: CongregacionPaisModel[]) => {
        this.paises = pais.filter((pais) => pais.estado === true);
      });
    }
  }

  crearPais() {
    const paisNuevo = this.paisForm.value;

    if (this.paisSeleccionado) {
      const data = {
        ...this.paisForm.value,
        id: this.paisSeleccionado.id,
      };

      // Si idObreroEncargado es null o vacío, lo convertimos a null
      if (!data.idObreroEncargado) {
        data.idObreroEncargado = null;
      }

      // Si idAdministrador es null, vacío o 0, lo convertimos a null
      if (!data.idAdministrador || data.idAdministrador === 0) {
        data.idAdministrador = null;
      } else {
        // Aseguramos que sea un número
        data.idAdministrador = Number(data.idAdministrador);
      }

      this.paisService.actualizarPais(data).subscribe((pais: any) => {
        Swal.fire({
          title: 'País Actualizado',
          icon: 'success',
          html: `El país ${pais.paisActualizado.pais} se actualizó correctamente`,
        });
        this.resetFormulario();
        this.cargarPaises();
      });
    } else {
      // Para crear país nuevo, también validamos el idAdministrador
      if (!paisNuevo.idAdministrador || paisNuevo.idAdministrador === 0) {
        paisNuevo.idAdministrador = null;
      } else {
        paisNuevo.idAdministrador = Number(paisNuevo.idAdministrador);
      }

      if (!paisNuevo.idObreroEncargado) {
        paisNuevo.idObreroEncargado = null;
      }

      this.paisService.crearPais(paisNuevo).subscribe(
        (paisCreado: any) => {
          Swal.fire('Pais creado', `${paisCreado.pais.pais}`, 'success');
          this.resetFormulario();
          this.cargarPaises();
        },
        (error) => {
          const errores = error.error.errors as { [key: string]: { msg: string } };
          const listaErrores: string[] = [];

          Object.entries(errores).forEach(([key, value]) => {
            listaErrores.push('° ' + value['msg'] + '<br>');
          });

          Swal.fire({
            title: 'Error al crear pais',
            icon: 'error',
            html: `${listaErrores.join('')}`,
          });
        },
      );
    }
  }

  buscarPais(id: string): void {
    // Si el id es "nuevo", simplemente salir de la función
    if (id === 'nuevo') return;

    // Obtener el país solo si el id no es "nuevo"
    this.paisService
      .getPais(Number(id))
      .pipe(delay(100))
      .subscribe(
        (paisEncontrado: CongregacionPaisModel) => {
          const { pais, idObreroEncargado, idDivisa, idAdministrador } = paisEncontrado;
          this.paisSeleccionado = paisEncontrado;

          this.paisForm.setValue({ pais, idDivisa, idObreroEncargado, idAdministrador });

          // Buscar el administrador si existe
          if (idAdministrador) {
            this.buscarAdministrador(idAdministrador);
          }
        },
        (error) => {
          const errores = error.error.errors || [];
          const listaErrores = Object.entries(errores).map(([, value]) => '° ' + value['msg'] + '<br>');

          Swal.fire({
            title: 'Error en Congregación',
            icon: 'error',
            html: listaErrores.length ? listaErrores.join('') : 'Ocurrió un error al obtener el país.',
          }).then(() => {
            this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.PAISES}`);
          });
        },
      );
  }

  /**
   * Busca el administrador por su número Mita y muestra su nombre
   */
  buscarAdministrador(numeroMita?: number): void {
    const idAdministrador = numeroMita || this.paisForm.get('idAdministrador')?.value;

    // Limpiar estado previo
    this.administradorEncontrado = null;
    this.errorBusquedaAdministrador = false;

    // Si no hay número Mita, salir
    if (!idAdministrador || idAdministrador === 0) {
      return;
    }

    this.buscandoAdministrador = true;

    this.usuarioService.getUsuario(Number(idAdministrador)).subscribe(
      (response: UsuarioInterface) => {
        this.administradorEncontrado = response.usuario;
        this.buscandoAdministrador = false;
        this.errorBusquedaAdministrador = false;
      },
      (error) => {
        this.administradorEncontrado = null;
        this.buscandoAdministrador = false;
        this.errorBusquedaAdministrador = true;
        console.error('Error al buscar administrador:', error);
      },
    );
  }

  /**
   * Obtiene el nombre completo del administrador
   */
  getNombreAdministrador(): string {
    if (!this.administradorEncontrado) return '';

    const { primerNombre, segundoNombre, primerApellido, segundoApellido } = this.administradorEncontrado;
    const nombre = [primerNombre, segundoNombre, primerApellido, segundoApellido].filter((n) => n).join(' ');
    return nombre;
  }

  resetFormulario() {
    this.paisForm.reset();
    this.administradorEncontrado = null;
    this.errorBusquedaAdministrador = false;
  }
}
