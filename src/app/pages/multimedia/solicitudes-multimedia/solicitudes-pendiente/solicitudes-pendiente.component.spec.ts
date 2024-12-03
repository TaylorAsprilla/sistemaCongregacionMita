import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesPendienteComponent } from './solicitudes-pendiente.component';

describe('SolicitudesPendienteComponent', () => {
  let component: SolicitudesPendienteComponent;
  let fixture: ComponentFixture<SolicitudesPendienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesPendienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesPendienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
