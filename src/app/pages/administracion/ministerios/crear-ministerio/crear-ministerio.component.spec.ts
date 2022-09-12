import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMinisterioComponent } from './crear-ministerio.component';

describe('CrearMinisterioComponent', () => {
  let component: CrearMinisterioComponent;
  let fixture: ComponentFixture<CrearMinisterioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearMinisterioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearMinisterioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
