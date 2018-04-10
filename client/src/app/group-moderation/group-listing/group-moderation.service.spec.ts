import { TestBed, inject } from '@angular/core/testing';

import { GroupModerationService } from './group-moderation.service';

describe('GroupModerationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupModerationService]
    });
  });

  it('should ...', inject([GroupModerationService], (service: GroupModerationService) => {
    expect(service).toBeTruthy();
  }));
});
