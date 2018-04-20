import { TestBed, inject } from '@angular/core/testing';

import { SignupListingService } from './signup-listing.service';

describe('SignupListingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignupListingService]
    });
  });

  it('should ...', inject([SignupListingService], (service: SignupListingService) => {
    expect(service).toBeTruthy();
  }));
});
