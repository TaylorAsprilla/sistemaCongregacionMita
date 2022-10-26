import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioFamiliaresComponent } from './formulario-familiares.component';

describe('FormularioFamiliaresComponent', () => {
  let component: FormularioFamiliaresComponent;
  let fixture: ComponentFixture<FormularioFamiliaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioFamiliaresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioFamiliaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
