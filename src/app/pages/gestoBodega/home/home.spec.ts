import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeGestorBodega } from './home';

describe('Home', () => {
  let component: HomeGestorBodega;
  let fixture: ComponentFixture<HomeGestorBodega>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeGestorBodega],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeGestorBodega);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
