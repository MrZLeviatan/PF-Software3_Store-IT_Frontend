import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAuxiliar } from './home';

describe('Home', () => {
  let component: HomeAuxiliar;
  let fixture: ComponentFixture<HomeAuxiliar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeAuxiliar],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeAuxiliar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
