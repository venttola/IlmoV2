import { TestBed, inject } from '@angular/core/testing';

import { EventCreatorService } from './event-creator.service';
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";

describe('EventCreatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, FormsModule],
      providers: [EventCreatorService]
    });
  });

  it('should ...', inject([EventCreatorService], (service: EventCreatorService) => {
    expect(service).toBeTruthy();
  }));
});
