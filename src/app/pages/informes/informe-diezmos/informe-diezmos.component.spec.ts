import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeDiezmosComponent } from './informe-diezmos.component';

describe('InformeDiezmosComponent', () => {
  let component: InformeDiezmosComponent;
  let fixture: ComponentFixture<InformeDiezmosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InformeDiezmosComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeDiezmosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
