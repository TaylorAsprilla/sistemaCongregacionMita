import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CensoObreroComponent } from './censo-obrero.component';

describe('CensoObreroComponent', () => {
  let component: CensoObreroComponent;
  let fixture: ComponentFixture<CensoObreroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CensoObreroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CensoObreroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
