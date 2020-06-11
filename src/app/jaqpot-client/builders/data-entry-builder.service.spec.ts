import { TestBed } from '@angular/core/testing';

import { DataEntryBuilderService } from './data-entry-builder.service';

describe('DataEntryBuilderService', () => {
  let service: DataEntryBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataEntryBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
