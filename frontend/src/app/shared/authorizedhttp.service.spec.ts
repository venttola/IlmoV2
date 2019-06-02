import { TestBed, inject } from '@angular/core/testing';

import { AuthorizedHttpService } from './authorizedhttp.service';
import { HttpModule } from "@angular/http";

describe('AuthorizedHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [AuthorizedHttpService]
    });
  });

  it('should ...', inject([AuthorizedHttpService], (service: AuthorizedHttpService) => {
    expect(service).toBeTruthy();
  }));
});
