import { TestBed, inject } from '@angular/core/testing';

import { EventService } from './event.service';
import { HttpModule } from "@angular/http";

describe('EventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [EventService]
    });
  });

  it('should ...', inject([EventService], (service: EventService) => {
    expect(service).toBeTruthy();
  }));
});
