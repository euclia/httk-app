import { TestBed } from '@angular/core/testing';

import { FeatureBuilderService } from './feature-builder.service';

describe('FeatureBuilderService', () => {
  let service: FeatureBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
