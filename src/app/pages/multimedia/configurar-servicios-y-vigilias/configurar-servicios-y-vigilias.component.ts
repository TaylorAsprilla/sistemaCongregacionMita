import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PLATAFORMA, TIPOEVENTO } from 'src/app/core/models/link-evento.model';
import { LinkEventosService } from 'src/app/services/link-eventos/link-eventos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configurar-servicios-y-vigilias',
  templateUrl: './configurar-servicios-y-vigilias.component.html',
  styleUrls: ['./configurar-servicios-y-vigilias.component.scss'],
})
export class ConfigurarServiciosYVigiliasComponent implements OnInit {
  public serviciosForm: FormGroup;
  public vigiliasForm: FormGroup;

  get PLATAFORMA() {
    return PLATAFORMA;
  }

  get TIPOEVENTO() {
    return TIPOEVENTO;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private linkEventosService: LinkEventosService
  ) {}

  ngOnInit(): void {
    this.serviciosForm = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      link: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', [Validators.required, Validators.minLength(3)]],
      tipoEvento_id: ['', [Validators.required]],
      plataforma: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  guardarServicio() {
    const servicio = this.serviciosForm.value;

    this.linkEventosService.crearEvento(servicio).subscribe(
      (respuesta: any) => {
        Swal.fire('Servicio', 'Se cargó el servicio correctamente', 'success');
        this.serviciosForm.reset();
      },
      (error) => {
        let errores = error.error.errors;
        let listaErrores = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Servicio',
          icon: 'error',
          html: `Error al guardar el servicio <p> ${listaErrores.join('')}`,
        });
      }
    );
  }
}
