import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroA } from './registro-a';

describe('RegistroA', () => {
  let component: RegistroA;
  let fixture: ComponentFixture<RegistroA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
