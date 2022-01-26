import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BredcrumbsComponent } from './bredcrumbs.component';

describe('BredcrumbsComponent', () => {
  let component: BredcrumbsComponent;
  let fixture: ComponentFixture<BredcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BredcrumbsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BredcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
