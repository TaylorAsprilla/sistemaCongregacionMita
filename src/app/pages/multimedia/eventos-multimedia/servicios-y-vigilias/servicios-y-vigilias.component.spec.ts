import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosYVigiliasComponent } from './servicios-y-vigilias.component';

describe('ServiciosYVigiliasComponent', () => {
  let component: ServiciosYVigiliasComponent;
  let fixture: ComponentFixture<ServiciosYVigiliasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiciosYVigiliasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosYVigiliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
