import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionHomeComponent } from './seccion-home.component';

describe('SeccionHomeComponent', () => {
  let component: SeccionHomeComponent;
  let fixture: ComponentFixture<SeccionHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
