import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarCuentaComponent } from './recuperar-cuenta.component';

describe('RecuperarCuentaComponent', () => {
  let component: RecuperarCuentaComponent;
  let fixture: ComponentFixture<RecuperarCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecuperarCuentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperarCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
