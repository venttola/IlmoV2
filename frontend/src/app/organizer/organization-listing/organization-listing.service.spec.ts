import { TestBed, inject } from '@angular/core/testing';

import { OrganizationListingService } from './organization-listing.service';

describe('OrganizationListingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizationListingService]
    });
  });

  it('should be created', inject([OrganizationListingService], (service: OrganizationListingService) => {
    expect(service).toBeTruthy();
  }));
});
