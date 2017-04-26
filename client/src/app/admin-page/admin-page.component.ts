import { Component, Input, OnInit } from '@angular/core';

import { Event } from "../event.model";
import { EventCreatorService } from "./event-creator.service";
@Component({
	selector: 'app-admin-page',
	templateUrl: './admin-page.component.html',
	styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
	@Input() newEvent: Event;
	response: any;
	error: any;
	constructor(private eventCreatorService: EventCreatorService) { 
		this.newEvent = new Event;
	}

	ngOnInit() {
	}
	createEvent(){
		this.eventCreatorService.createEvent(this.newEvent).subscribe( response => this.response = response, error => this.error = <any>error);
	}
}
