import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerProductos } from './ver-productos';

describe('VerProductos', () => {
  let component: VerProductos;
  let fixture: ComponentFixture<VerProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
