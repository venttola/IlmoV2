import { Component, OnInit } from '@angular/core';

import { Event } from "../../event.model";

import { EventService } from "../../event.service";
import { EventManagementService } from "./event-management.service";
@Component({
	selector: 'event-management',
	templateUrl: './event-management.component.html',
	styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {
	events: Event[];
	error: any;
	constructor(private eventManagementService: EventManagementService) {

	}

	ngOnInit() {
		
	}

}
