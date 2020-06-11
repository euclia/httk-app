import { TestBed } from '@angular/core/testing';

import { DatasetToViewdataService } from './dataset-to-viewdata.service';

describe('DatasetToViewdataService', () => {
  let service: DatasetToViewdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetToViewdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
