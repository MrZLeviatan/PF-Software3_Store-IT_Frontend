import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroProductos } from './registro-productos';

describe('RegistroProductos', () => {
  let component: RegistroProductos;
  let fixture: ComponentFixture<RegistroProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
