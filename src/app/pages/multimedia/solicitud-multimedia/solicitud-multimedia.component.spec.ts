import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudMultimediaComponent } from './solicitud-multimedia.component';

describe('SolicitudMultimediaComponent', () => {
  let component: SolicitudMultimediaComponent;
  let fixture: ComponentFixture<SolicitudMultimediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudMultimediaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudMultimediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
