import { TestBed, inject } from '@angular/core/testing';

import { EventListingService } from './event-listing.service';

describe('EventListingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventListingService]
    });
  });

  it('should be created', inject([EventListingService], (service: EventListingService) => {
    expect(service).toBeTruthy();
  }));
});
