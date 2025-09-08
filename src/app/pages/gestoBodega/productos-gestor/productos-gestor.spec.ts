import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosGestor } from './productos-gestor';

describe('ProductosGestor', () => {
  let component: ProductosGestor;
  let fixture: ComponentFixture<ProductosGestor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosGestor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosGestor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
