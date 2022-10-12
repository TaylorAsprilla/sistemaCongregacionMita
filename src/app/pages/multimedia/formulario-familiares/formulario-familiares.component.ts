import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FamiliarModel } from 'src/app/core/models/familiar.model';
import { NacionalidadModel } from 'src/app/core/models/nacionalidad.model';
import { ParentescoModel } from 'src/app/core/models/parentesco.model';

@Component({
  selector: 'app-formulario-familiares',
  templateUrl: './formulario-familiares.component.html',
  styleUrls: ['./formulario-familiares.component.scss'],
})
export class FormularioFamiliaresComponent implements OnInit {
  @Input() parentescos: ParentescoModel[];
  @Input() paisesPreferidos: CountryISO[];
  @Input() nacionalidades: NacionalidadModel[] = [];

  @Output() valoresFormulario = new EventEmitter<FamiliarModel[]>();

  public familiaresForm: FormGroup;

  codigoDeMarcadoSeparado = false;
  buscarPais = SearchCountryField;
  paisISO = CountryISO;
  formatoNumeroTelefonico = PhoneNumberFormat;

  letrasFiltrarNacionalidad: Observable<NacionalidadModel[]>;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.familiaresForm = this.formBuilder.group({
      familiares: this.formBuilder.array([
        this.formBuilder.group({
          nombre: ['Familiar Uno', [Validators.required, Validators.minLength(3)]],
          parentesco: ['2', [Validators.required]],
          email: ['familia@hotmail.com', [Validators.minLength(3), Validators.email]],
          telefono: ['+57 6012035614', [Validators.minLength(3)]],
          celular: ['+57 3118873332', [Validators.required, Validators.minLength(3)]],
          pais: ['Puerto Rico', [Validators.required, Validators.minLength(3)]],
        }),
      ]),
    });
  }
  get getFamiliares() {
    return this.familiaresForm.get('familiares') as FormArray;
  }

  buscarNacionalidad(formControlName: string, index: number) {
    const control = this.getFamiliares.controls[index].get(formControlName).valueChanges;

    this.letrasFiltrarNacionalidad = control.pipe(
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

  agregarFamiliar() {
    const control = <FormArray>this.familiaresForm.controls['familiares'];
    control.push(
      this.formBuilder.group({
        nombre: ['Familiar 2', [Validators.required, Validators.minLength(3)]],
        parentesco: ['2', [Validators.required]],
        email: ['familiar@yahoo.es', [Validators.minLength(3), Validators.email]],
        telefono: ['+576012035647', [Validators.minLength(3)]],
        celular: ['+57 311887332', [Validators.required, Validators.minLength(3)]],
        pais: ['Singapur', [Validators.required, Validators.minLength(3)]],
      })
    );
  }

  eliminarFamiliar(index: number) {
    const control = <FormArray>this.familiaresForm.controls['familiares'];
    control.removeAt(index);
  }

  crearSolicitud() {
    const value = this.familiaresForm.value;
    console.log('Familiares', value);
    this.valoresFormulario.emit(value);
  }
}
