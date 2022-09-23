import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoMultimediaComponent } from './acceso-multimedia.component';

describe('AccesoMultimediaComponent', () => {
  let component: AccesoMultimediaComponent;
  let fixture: ComponentFixture<AccesoMultimediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccesoMultimediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccesoMultimediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
