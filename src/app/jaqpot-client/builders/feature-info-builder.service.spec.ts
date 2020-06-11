import { TestBed } from '@angular/core/testing';

import { FeatureInfoBuilderService } from './feature-info-builder.service';

describe('FeatureInfoBuilderService', () => {
  let service: FeatureInfoBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureInfoBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
