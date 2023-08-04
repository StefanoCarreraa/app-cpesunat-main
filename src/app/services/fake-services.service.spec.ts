import { TestBed } from '@angular/core/testing';

import { FakeServicesService } from './fake-services.service';

describe('FakeServicesService', () => {
  let service: FakeServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FakeServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
