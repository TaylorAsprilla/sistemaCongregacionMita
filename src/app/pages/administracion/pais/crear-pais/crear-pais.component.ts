import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ListarUsuario } from 'src/app/core/interfaces/usuario.interface';
import { DivisaModel } from 'src/app/core/models/divisa.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { DivisaService } from 'src/app/services/divisa/divisa.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { ObreroInterface, ObreroModel } from 'src/app/core/models/obrero.model';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-crear-pais',
  templateUrl: './crear-pais.component.html',
  styleUrls: ['./crear-pais.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgxIntlTelInputModule],
})
export class CrearPaisComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private paisService = inject(PaisService);
  private divisaService = inject(DivisaService);
  private usuariosService = inject(UsuarioService);
  private activatedRoute = inject(ActivatedRoute);

  public paisForm: FormGroup;

  public paises: CongregacionPaisModel[] = [];
  public divisas: DivisaModel[] = [];
  public usuarios: UsuarioModel[] = [];
  public obreros: ObreroInterface[] = [];

  public paisSeleccionado: CongregacionPaisModel;

  // Subscription
  public paisSubscription: Subscription;
  public divisaSubscription: Subscription;
  public usuariosSubscription: Subscription;

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

    this.usuariosSubscription = this.usuariosService.listarTodosLosUsuarios().subscribe((usuarios: ListarUsuario) => {
      this.usuarios = usuarios.usuarios;
    });

    this.cargarPaises();
    this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.divisaSubscription?.unsubscribe();
    this.paisSubscription?.unsubscribe();
    this.usuariosSubscription?.unsubscribe();
  }

  crearFormulario() {
    this.paisForm = this.formBuilder.group({
      pais: ['', [Validators.required, Validators.minLength(3)]],
      idDivisa: [null, [Validators.required]],
      idObreroEncargado: ['', [Validators.required]],
    });
  }

  cargarPaises() {
    this.paisSubscription = this.paisService.getPaises().subscribe((pais: CongregacionPaisModel[]) => {
      this.paises = pais.filter((pais) => pais.estado === true);
    });
  }

  crearPais() {
    const paisNuevo = this.paisForm.value;

    if (paisNuevo.idObreroEncargado === 'null') {
      delete paisNuevo.idObreroEncargado;
    }

    if (this.paisSeleccionado) {
      const data = {
        ...this.paisForm.value,
        id: this.paisSeleccionado.id,
      };

      this.paisService.actualizarPais(data).subscribe((pais: any) => {
        Swal.fire({
          title: 'País Actualizado',
          icon: 'success',
          html: `El país ${pais.paisActualizado.pais} se actualizó correctamente`,
        });
      });
      this.resetFormulario();
      this.cargarPaises();
    } else {
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
        }
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
          const { pais, idObreroEncargado, idDivisa } = paisEncontrado;
          this.paisSeleccionado = paisEncontrado;

          this.paisForm.setValue({ pais, idDivisa, idObreroEncargado });
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
        }
      );
  }

  resetFormulario() {
    this.paisForm.reset();
  }
}
