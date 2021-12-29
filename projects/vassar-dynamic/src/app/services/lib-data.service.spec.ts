import { TestBed } from '@angular/core/testing';

import { LibDataService } from './lib-data.service';

describe('LibDataService', () => {
  let service: LibDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
