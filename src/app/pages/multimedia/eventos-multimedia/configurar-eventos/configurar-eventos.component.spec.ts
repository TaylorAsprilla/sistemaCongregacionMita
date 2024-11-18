import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarEventosComponent } from './configurar-eventos.component';

describe('ConfigurarEventosComponent', () => {
  let component: ConfigurarEventosComponent;
  let fixture: ComponentFixture<ConfigurarEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ConfigurarEventosComponent],
}).compileComponents();

    fixture = TestBed.createComponent(ConfigurarEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
