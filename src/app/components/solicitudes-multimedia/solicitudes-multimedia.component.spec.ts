import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesMultimediaComponent } from './solicitudes-multimedia.component';

describe('SolicitudesMultimediaComponent', () => {
  let component: SolicitudesMultimediaComponent;
  let fixture: ComponentFixture<SolicitudesMultimediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesMultimediaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesMultimediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
