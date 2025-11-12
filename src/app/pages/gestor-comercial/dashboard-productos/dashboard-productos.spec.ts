import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProductos } from './dashboard-productos';

describe('DashboardProductos', () => {
  let component: DashboardProductos;
  let fixture: ComponentFixture<DashboardProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
