import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogroModel } from 'src/app/core/models/logro.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { LogroService } from 'src/app/services/logro/logro.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-informe-logros',
    templateUrl: './informe-logros.component.html',
    styleUrls: ['./informe-logros.component.scss'],
    standalone: true,
    imports: [
    FormsModule,
    ReactiveFormsModule
],
})
export class InformeLogrosComponent implements OnInit, OnDestroy {
  public logroForm: UntypedFormGroup;

  public logros: LogroModel[] = [];

  // Subscription
  public logroSubscription: Subscription;
  constructor(private formBuilder: UntypedFormBuilder, private router: Router, private logroService: LogroService) {}

  ngOnInit(): void {
    this.logroForm = this.formBuilder.group({
      logro: ['', [Validators.required]],
      responsable: ['', [Validators.required]],
      comentarios: ['', []],
      informe_id: ['1', [Validators.required]],
    });

    this.logroSubscription = this.logroService.getLogros().subscribe((logro: LogroModel[]) => {
      this.logros = logro;
    });
  }

  ngOnDestroy(): void {
    this.logroSubscription?.unsubscribe();
  }

  guardarLogro() {
    const informeLogro = this.logroForm.value;

    this.logroService.crearLogro(informeLogro).subscribe(
      (logroCreado: any) => {
        Swal.fire('Logros', 'Se registró el logro correctamente', 'success');
        this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INFORME}`);
      },
      (error) => {
        const errores = error.error.errors as { [key: string]: { msg: string } };
        const listaErrores: string[] = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Logros',
          icon: 'error',
          html: `Error al guardar el logro <p> ${listaErrores.join('')}`,
        });
      }
    );
  }
}
