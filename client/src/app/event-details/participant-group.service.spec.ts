import { TestBed, inject } from '@angular/core/testing';

import { ParticipantGroupService } from './participant-group.service';

describe('ParticipantGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParticipantGroupService]
    });
  });

  it('should ...', inject([ParticipantGroupService], (service: ParticipantGroupService) => {
    expect(service).toBeTruthy();
  }));
});
