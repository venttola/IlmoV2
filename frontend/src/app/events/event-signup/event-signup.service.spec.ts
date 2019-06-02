import { TestBed, inject } from '@angular/core/testing';

import { EventSignupService } from './event-signup.service';

describe('EventSignupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventSignupService]
    });
  });

  it('should ...', inject([EventSignupService], (service: EventSignupService) => {
    expect(service).toBeTruthy();
  }));
});
