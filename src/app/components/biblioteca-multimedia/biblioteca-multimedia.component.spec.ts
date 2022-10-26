import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliotecaMultimediaComponent } from './biblioteca-multimedia.component';

describe('BibliotecaMultimediaComponent', () => {
  let component: BibliotecaMultimediaComponent;
  let fixture: ComponentFixture<BibliotecaMultimediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BibliotecaMultimediaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibliotecaMultimediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
