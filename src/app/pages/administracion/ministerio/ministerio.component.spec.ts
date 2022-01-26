import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinisterioComponent } from './ministerio.component';

describe('MinisterioComponent', () => {
  let component: MinisterioComponent;
  let fixture: ComponentFixture<MinisterioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinisterioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinisterioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
