import { TestBed, inject } from '@angular/core/testing';

import { AuthorizedHttpService } from './authorizedhttp.service';

describe('AuthorizedHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthorizedHttpService]
    });
  });

  it('should ...', inject([AuthorizedHttpService], (service: AuthorizedHttpService) => {
    expect(service).toBeTruthy();
  }));
});
