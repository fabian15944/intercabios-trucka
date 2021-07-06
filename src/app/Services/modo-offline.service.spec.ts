import { TestBed } from '@angular/core/testing';

import { ModoOfflineService } from './modo-offline.service';

describe('ModoOfflineService', () => {
  let service: ModoOfflineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModoOfflineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
