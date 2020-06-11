import { TestBed } from '@angular/core/testing';

import { DatasetFactoryService } from './dataset-factory.service';

describe('DatasetFactoryService', () => {
  let service: DatasetFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
