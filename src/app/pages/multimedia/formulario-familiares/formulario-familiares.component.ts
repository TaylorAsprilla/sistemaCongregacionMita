import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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

  public familiaresForm: FormGroup;

  public formulario: FormGroup;
  codigoDeMarcadoSeparado = false;
  buscarPais = SearchCountryField;
  paisISO = CountryISO;
  formatoNumeroTelefonico = PhoneNumberFormat;

  letrasFiltrarNacionalidad: Observable<NacionalidadModel[]>;

  controles: any;

  numeroFormularios = [1, 2, 3, 4, 5, 6];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // this.crearFormularioDeFamiliares();

    this.familiaresForm = this.formBuilder.group({
      familiares: this.formBuilder.array([
        this.formBuilder.group({
          nombre: ['', [Validators.required, Validators.minLength(3)]],
          parentesco: ['', [Validators.required]],
          celular: ['', [Validators.required, Validators.minLength(3)]],
          pais: ['', [Validators.required, Validators.minLength(3)]],
        }),
      ]),
    });
  }

  get getFamiliares() {
    return this.familiaresForm.get('familiares') as FormArray;
  }

  buscarNacionalidad(formControlName: string) {
    this.letrasFiltrarNacionalidad = this.familiaresForm.get(formControlName.toString()).valueChanges.pipe(
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
    control.push(this.formBuilder.group({ nombre: [], parentesco: [], celular: [], pais: [] }));
  }

  eliminarFamiliar(index: number) {
    const control = <FormArray>this.familiaresForm.controls['familiares'];
    control.removeAt(index);
  }

  crearSolicitud() {}
}
