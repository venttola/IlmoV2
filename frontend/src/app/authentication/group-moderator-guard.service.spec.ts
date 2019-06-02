import { TestBed, inject } from '@angular/core/testing';

import { GroupModeratorGuardService } from './group-moderator-guard.service';

describe('GroupModeratorGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupModeratorGuardService]
    });
  });

  it('should ...', inject([GroupModeratorGuardService], (service: GroupModeratorGuardService) => {
    expect(service).toBeTruthy();
  }));
});
