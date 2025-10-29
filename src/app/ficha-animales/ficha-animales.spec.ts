import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAnimales } from './ficha-animales';

describe('FichaAnimales', () => {
  let component: FichaAnimales;
  let fixture: ComponentFixture<FichaAnimales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaAnimales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaAnimales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
