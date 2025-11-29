import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaseComponent } from './fase.component';

describe('FaseComponent', () => {
  let component: FaseComponent;
  let fixture: ComponentFixture<FaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
