import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarProductosAuxiliar } from './registrar-productos-auxiliar';

describe('RegistrarProductosAuxiliar', () => {
  let component: RegistrarProductosAuxiliar;
  let fixture: ComponentFixture<RegistrarProductosAuxiliar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarProductosAuxiliar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarProductosAuxiliar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
