import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoGemelosComponent } from './grupo-gemelos.component';

describe('GrupoGemelosComponent', () => {
  let component: GrupoGemelosComponent;
  let fixture: ComponentFixture<GrupoGemelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupoGemelosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoGemelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
