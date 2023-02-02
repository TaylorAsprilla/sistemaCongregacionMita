import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionDeTransporteComponent } from './opcion-de-transporte.component';

describe('OpcionDeTransporteComponent', () => {
  let component: OpcionDeTransporteComponent;
  let fixture: ComponentFixture<OpcionDeTransporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpcionDeTransporteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpcionDeTransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
