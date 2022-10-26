import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarServiciosYVigiliasComponent } from './configurar-servicios-y-vigilias.component';

describe('ConfigurarServiciosYVigiliasComponent', () => {
  let component: ConfigurarServiciosYVigiliasComponent;
  let fixture: ComponentFixture<ConfigurarServiciosYVigiliasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurarServiciosYVigiliasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurarServiciosYVigiliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
