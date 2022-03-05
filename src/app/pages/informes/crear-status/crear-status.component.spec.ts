import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearStatusComponent } from './crear-status.component';

describe('CrearStatusComponent', () => {
  let component: CrearStatusComponent;
  let fixture: ComponentFixture<CrearStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
