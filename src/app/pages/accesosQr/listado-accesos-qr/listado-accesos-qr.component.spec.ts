import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoAccesosQRComponent } from './listado-accesos-qr.component';

describe('ListadoAccesosQRComponent', () => {
  let component: ListadoAccesosQRComponent;
  let fixture: ComponentFixture<ListadoAccesosQRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoAccesosQRComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoAccesosQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
