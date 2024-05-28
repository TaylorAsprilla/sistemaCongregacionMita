import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-crear-pais',
  templateUrl: './crear-pais.component.html',
  styleUrls: ['./crear-pais.component.scss'],
})
export class CrearPaisComponent implements OnInit, OnDestroy {
  public paisForm: FormGroup;

  public paises: CongregacionPaisModel[] = [];
  public divisas: DivisaModel[] = [];
  public usuarios: UsuarioModel[] = [];
  public obreros: UsuarioModel[] = [];

  public paisSeleccionado: CongregacionPaisModel;

  // Subscription
  public paisSubscription: Subscription;
  public divisaSubscription: Subscription;
  public usuariosSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private paisService: PaisService,
    private divisaService: DivisaService,
    private usuariosService: UsuarioService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.buscarPais(id);
    });

    this.activatedRoute.data.subscribe((data: { obrero: UsuarioModel[] }) => {
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
          let errores = error.error.errors;
          let listaErrores = [];

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

  buscarPais(id: string) {
    if (id !== 'nuevo') {
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

            return this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.PAISES}`);
          }
        );
    }
  }

  resetFormulario() {
    this.paisForm.reset();
  }
}
