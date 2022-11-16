import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposDeDocumentosComponent } from './tipos-de-documentos.component';

describe('TiposDeDocumentosComponent', () => {
  let component: TiposDeDocumentosComponent;
  let fixture: ComponentFixture<TiposDeDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposDeDocumentosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposDeDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
