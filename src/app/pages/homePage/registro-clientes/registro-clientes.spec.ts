import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroClientes } from './registro-clientes';

describe('RegistroClientes', () => {
  let component: RegistroClientes;
  let fixture: ComponentFixture<RegistroClientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroClientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroClientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
