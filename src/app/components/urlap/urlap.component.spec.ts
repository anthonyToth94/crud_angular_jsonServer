import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlapComponent } from './urlap.component';

describe('UrlapComponent', () => {
  let component: UrlapComponent;
  let fixture: ComponentFixture<UrlapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UrlapComponent]
    });
    fixture = TestBed.createComponent(UrlapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
