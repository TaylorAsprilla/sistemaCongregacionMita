import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeSituacionVisitaComponent } from './informe-situacion-visita.component';

describe('SituacionVisitaComponent', () => {
  let component: InformeSituacionVisitaComponent;
  let fixture: ComponentFixture<InformeSituacionVisitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InformeSituacionVisitaComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeSituacionVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
