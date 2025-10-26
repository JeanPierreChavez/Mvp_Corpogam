import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vacunas } from './vacunas';

describe('Vacunas', () => {
  let component: Vacunas;
  let fixture: ComponentFixture<Vacunas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vacunas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vacunas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
