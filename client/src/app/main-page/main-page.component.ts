import { Component, OnInit } from '@angular/core';
import { Event } from "../event-model";

import { EventService } from "../event.service";
import { AuthService } from "../authentication/auth.service";
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  eventList: Event[];
  error: any;
  constructor(private eventService: EventService,
              private authService: AuthService) { 
  }

  ngOnInit() {
  	this.getEvents();

  }
  getEvents(){
  	this.eventService.getEventListing().subscribe(events => this.eventList = events,
  												  error => this.error = <any>error);
  }
  logout(): void {
    this.authService.logout();
  }
}
