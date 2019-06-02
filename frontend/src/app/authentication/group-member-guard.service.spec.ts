import { TestBed, inject } from '@angular/core/testing';

import { GroupMemberGuardService } from './group-member-guard.service';

describe('GroupMemberGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupMemberGuardService]
    });
  });

  it('should ...', inject([GroupMemberGuardService], (service: GroupMemberGuardService) => {
    expect(service).toBeTruthy();
  }));
});
