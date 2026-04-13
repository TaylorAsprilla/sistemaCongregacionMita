import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionesActivasComponent } from './sesiones-activas.component';

describe('SesionesActivasComponent', () => {
  let component: SesionesActivasComponent;
  let fixture: ComponentFixture<SesionesActivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SesionesActivasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SesionesActivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
