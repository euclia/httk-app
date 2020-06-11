import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbpkPredictedComponent } from './pbpk-predicted.component';

describe('PbpkPredictedComponent', () => {
  let component: PbpkPredictedComponent;
  let fixture: ComponentFixture<PbpkPredictedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbpkPredictedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbpkPredictedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
