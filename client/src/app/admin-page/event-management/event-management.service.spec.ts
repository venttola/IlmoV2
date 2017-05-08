import { TestBed, inject } from '@angular/core/testing';

import { EventManagementService } from './event-management.service';

describe('EventManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventManagementService]
    });
  });

  it('should ...', inject([EventManagementService], (service: EventManagementService) => {
    expect(service).toBeTruthy();
  }));
});
