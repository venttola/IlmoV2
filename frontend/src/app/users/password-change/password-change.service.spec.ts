import { TestBed, inject } from '@angular/core/testing';

import { PasswordChangeService } from './password-change.service';

describe('PasswordChangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordChangeService]
    });
  });

  it('should be created', inject([PasswordChangeService], (service: PasswordChangeService) => {
    expect(service).toBeTruthy();
  }));
});
