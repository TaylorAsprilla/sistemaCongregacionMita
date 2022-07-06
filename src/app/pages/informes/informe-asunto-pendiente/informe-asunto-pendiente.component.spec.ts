import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeAsuntoPendienteComponent } from './informe-asunto-pendiente.component';

describe('InformeAsuntoPendienteComponent', () => {
  let component: InformeAsuntoPendienteComponent;
  let fixture: ComponentFixture<InformeAsuntoPendienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformeAsuntoPendienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeAsuntoPendienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
