import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SituacionVisitaModel } from 'src/app/core/models/situacion-visita.model';

@Component({
  selector: 'app-informe-situacion-visita',
  templateUrl: './informe-situacion-visita.component.html',
  styleUrls: ['./informe-situacion-visita.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class InformeSituacionVisitaComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private router = inject(Router);

  public situacionVisitaForm: UntypedFormGroup;

  public situacionVisitas: SituacionVisitaModel[] = [];

  // Subscription
  public situacionVisitaSubscription: Subscription;

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
