import { TestBed } from '@angular/core/testing';

import { TableToCsvService } from './table-to-csv.service';

describe('TableToCsvService', () => {
  let service: TableToCsvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableToCsvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
