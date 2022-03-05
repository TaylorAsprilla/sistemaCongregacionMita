import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeLogrosComponent } from './informe-logros.component';

describe('InformeLogrosComponent', () => {
  let component: InformeLogrosComponent;
  let fixture: ComponentFixture<InformeLogrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformeLogrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeLogrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
