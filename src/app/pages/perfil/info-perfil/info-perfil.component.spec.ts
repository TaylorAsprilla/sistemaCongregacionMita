import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPerfilComponent } from './info-perfil.component';

describe('InfoPerfilComponent', () => {
  let component: InfoPerfilComponent;
  let fixture: ComponentFixture<InfoPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPerfilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
