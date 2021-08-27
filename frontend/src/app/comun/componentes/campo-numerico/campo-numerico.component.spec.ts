import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampoNumericoComponent } from './campo-numerico.component';

describe('CampoNumericoComponent', () => {
  let component: CampoNumericoComponent;
  let fixture: ComponentFixture<CampoNumericoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampoNumericoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampoNumericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
