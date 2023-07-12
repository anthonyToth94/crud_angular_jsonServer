import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LekerdezesComponent } from './lekerdezes.component';

describe('LekerdezesComponent', () => {
  let component: LekerdezesComponent;
  let fixture: ComponentFixture<LekerdezesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LekerdezesComponent]
    });
    fixture = TestBed.createComponent(LekerdezesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
