import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgresoRadialComponent } from './progreso-radial.component';

describe('ProgresoRadialComponent', () => {
  let component: ProgresoRadialComponent;
  let fixture: ComponentFixture<ProgresoRadialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgresoRadialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgresoRadialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
