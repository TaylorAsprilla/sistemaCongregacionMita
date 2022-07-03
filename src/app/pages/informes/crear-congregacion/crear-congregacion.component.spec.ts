import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCongregacionComponent } from './crear-congregacion.component';

describe('CrearCongregacionComponent', () => {
  let component: CrearCongregacionComponent;
  let fixture: ComponentFixture<CrearCongregacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearCongregacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCongregacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
