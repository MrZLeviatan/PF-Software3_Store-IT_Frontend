import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabeasData } from './habeas-data';

describe('HabeasData', () => {
  let component: HabeasData;
  let fixture: ComponentFixture<HabeasData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabeasData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabeasData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
