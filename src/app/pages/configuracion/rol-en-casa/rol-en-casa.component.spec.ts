import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolEnCasaComponent } from './rol-en-casa.component';

describe('RolEnCasaComponent', () => {
  let component: RolEnCasaComponent;
  let fixture: ComponentFixture<RolEnCasaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RolEnCasaComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(RolEnCasaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
