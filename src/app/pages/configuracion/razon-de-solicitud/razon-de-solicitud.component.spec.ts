import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RazonDeSolicitudComponent } from './razon-de-solicitud.component';

describe('RazonDeSolicitudComponent', () => {
  let component: RazonDeSolicitudComponent;
  let fixture: ComponentFixture<RazonDeSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RazonDeSolicitudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RazonDeSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
