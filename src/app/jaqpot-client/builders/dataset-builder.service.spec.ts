import { TestBed } from '@angular/core/testing';

import { DatasetBuilderService } from './dataset-builder.service';

describe('DatasetBuilderService', () => {
  let service: DatasetBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
