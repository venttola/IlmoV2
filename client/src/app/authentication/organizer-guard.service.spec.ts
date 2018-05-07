import { TestBed, inject } from '@angular/core/testing';

import { OrganizerGuardService } from './organizer-guard.service';

describe('OrganizerGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizerGuardService]
    });
  });

  it('should be created', inject([OrganizerGuardService], (service: OrganizerGuardService) => {
    expect(service).toBeTruthy();
  }));
});
