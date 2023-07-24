import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrissitesComponent } from './frissites.component';

describe('FrissitesComponent', () => {
  let component: FrissitesComponent;
  let fixture: ComponentFixture<FrissitesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrissitesComponent]
    });
    fixture = TestBed.createComponent(FrissitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
