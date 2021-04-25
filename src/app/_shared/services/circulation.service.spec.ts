import { TestBed } from '@angular/core/testing';

import { CirculationService } from './circulation.service';

describe('CirculationService', () => {
  let service: CirculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CirculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
