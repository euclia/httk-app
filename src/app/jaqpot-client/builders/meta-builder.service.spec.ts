import { TestBed } from '@angular/core/testing';

import { MetaBuilderService } from './meta-builder.service';

describe('MetaBuilderService', () => {
  let service: MetaBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
