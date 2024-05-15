import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosEnVivoComponent } from './servicios-en-vivo.component';

describe('ServiciosEnVivoComponent', () => {
  let component: ServiciosEnVivoComponent;
  let fixture: ComponentFixture<ServiciosEnVivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiciosEnVivoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosEnVivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
