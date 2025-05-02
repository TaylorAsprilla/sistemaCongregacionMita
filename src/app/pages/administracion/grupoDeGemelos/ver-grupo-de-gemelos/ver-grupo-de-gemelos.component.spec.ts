import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerGrupoDeGemelosComponent } from './ver-grupo-de-gemelos.component';

describe('VerGrupoDeGemelosComponent', () => {
  let component: VerGrupoDeGemelosComponent;
  let fixture: ComponentFixture<VerGrupoDeGemelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerGrupoDeGemelosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerGrupoDeGemelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
