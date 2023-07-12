import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KivalasztComponent } from './kivalaszt.component';

describe('KivalasztComponent', () => {
  let component: KivalasztComponent;
  let fixture: ComponentFixture<KivalasztComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KivalasztComponent]
    });
    fixture = TestBed.createComponent(KivalasztComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
