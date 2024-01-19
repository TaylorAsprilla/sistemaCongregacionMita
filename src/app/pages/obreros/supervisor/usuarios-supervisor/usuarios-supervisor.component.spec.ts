import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosSupervisorComponent } from './usuarios-supervisor.component';

describe('UsuariosSupervisorComponent', () => {
  let component: UsuariosSupervisorComponent;
  let fixture: ComponentFixture<UsuariosSupervisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosSupervisorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
