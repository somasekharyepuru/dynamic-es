import { TestBed } from '@angular/core/testing';

import { VlStorageService } from './vl-storage.service';

describe('VlStorageService', () => {
  let service: VlStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VlStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
