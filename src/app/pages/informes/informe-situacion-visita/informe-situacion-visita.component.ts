import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SituacionVisitaModel } from 'src/app/core/models/situacion-visita.model';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-informe-situacion-visita',
    templateUrl: './informe-situacion-visita.component.html',
    styleUrls: ['./informe-situacion-visita.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgFor,
    ],
})
export class InformeSituacionVisitaComponent implements OnInit {
  public situacionVisitaForm: UntypedFormGroup;

  public situacionVisitas: SituacionVisitaModel[] = [];

  // Subscription
  public situacionVisitaSubscription: Subscription;

  constructor(private formBuilder: UntypedFormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.situacionVisitaForm = this.formBuilder.group({
      fecha: ['', [Validators.required]],
      nombreFeligres: ['', [Validators.required]],
      situacion: ['', []],
      intervencion: ['', []],
      seguimiento: ['', []],
      observaciones: ['', []],
      informe_id: ['1', [Validators.required]],
    });
  }
}
