import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosBibliotecaComponent } from './eventos.component';

describe('EventosBibliotecaComponent', () => {
  let component: EventosBibliotecaComponent;
  let fixture: ComponentFixture<EventosBibliotecaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosBibliotecaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventosBibliotecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
