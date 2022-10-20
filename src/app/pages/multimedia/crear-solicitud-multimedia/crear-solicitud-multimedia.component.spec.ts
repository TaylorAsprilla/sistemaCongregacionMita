import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSolicitudMultimediaComponent } from './crear-solicitud-multimedia.component';

describe('CrearSolicitudMultimediaComponent', () => {
  let component: CrearSolicitudMultimediaComponent;
  let fixture: ComponentFixture<CrearSolicitudMultimediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearSolicitudMultimediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearSolicitudMultimediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
