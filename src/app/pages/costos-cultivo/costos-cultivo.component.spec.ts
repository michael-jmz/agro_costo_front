import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosCultivoComponent } from './costos-cultivo.component';

describe('CostosCultivoComponent', () => {
  let component: CostosCultivoComponent;
  let fixture: ComponentFixture<CostosCultivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostosCultivoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostosCultivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
