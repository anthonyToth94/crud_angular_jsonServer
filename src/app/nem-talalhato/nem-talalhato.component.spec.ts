import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NemTalalhatoComponent } from './nem-talalhato.component';

describe('NemTalalhatoComponent', () => {
  let component: NemTalalhatoComponent;
  let fixture: ComponentFixture<NemTalalhatoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NemTalalhatoComponent]
    });
    fixture = TestBed.createComponent(NemTalalhatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
