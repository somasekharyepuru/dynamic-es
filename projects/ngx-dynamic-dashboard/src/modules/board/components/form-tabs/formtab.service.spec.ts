import { TestBed } from '@angular/core/testing';

import { FormtabService } from './formtab.service';

describe('FormtabService', () => {
  let service: FormtabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormtabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
