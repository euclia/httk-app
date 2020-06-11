import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttkmodelsComponent } from './httkmodels.component';

describe('HttkmodelsComponent', () => {
  let component: HttkmodelsComponent;
  let fixture: ComponentFixture<HttkmodelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttkmodelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttkmodelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
