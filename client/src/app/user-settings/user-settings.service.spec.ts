import { TestBed, inject } from '@angular/core/testing';

import { UserSettingsService } from './user-settings.service';
import { HttpModule } from "@angular/http";

describe('UserSettingsService ', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [UserSettingsService, ]
    });
  });

  it('should ...', inject([UserSettingsService ], (service: UserSettingsService ) => {
    expect(service).toBeTruthy();
  }));
});
