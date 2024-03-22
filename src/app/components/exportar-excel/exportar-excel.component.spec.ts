import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportarExcelComponent } from './exportar-excel.component';

describe('ExportarExcelComponent', () => {
  let component: ExportarExcelComponent;
  let fixture: ComponentFixture<ExportarExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportarExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportarExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
