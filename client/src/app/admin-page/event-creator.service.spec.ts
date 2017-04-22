import { TestBed, inject } from '@angular/core/testing';

import { EventCreatorService } from './event-creator.service';

describe('EventCreatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventCreatorService]
    });
  });

  it('should ...', inject([EventCreatorService], (service: EventCreatorService) => {
    expect(service).toBeTruthy();
  }));
});
