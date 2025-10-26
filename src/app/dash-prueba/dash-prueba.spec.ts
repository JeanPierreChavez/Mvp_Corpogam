import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashPrueba } from './dash-prueba';

describe('DashPrueba', () => {
  let component: DashPrueba;
  let fixture: ComponentFixture<DashPrueba>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashPrueba]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashPrueba);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
