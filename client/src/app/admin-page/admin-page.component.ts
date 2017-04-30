import { Component, Input, OnInit } from '@angular/core';

import { Event } from "../event.model";
import { Platoon } from "../platoon.model";
import { Organizer } from "../organizer.model";
import { EventCreatorService } from "./event-creator.service";
@Component({
	selector: 'app-admin-page',
	templateUrl: './admin-page.component.html',
	styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
	@Input() newEvent: Event;
	@Input() platoons: Platoon[];
	@Input() organizer: Organizer;
	result: any;
	error: any;
	constructor(private eventCreatorService: EventCreatorService) { 
		this.newEvent = new Event;
		this.platoons = new Array<Platoon>();
		this.organizer = new Organizer;
	}
	ngOnInit() {
	}
	createEvent(){
		this.eventCreatorService.createEvent(this.newEvent, this.platoons, this.organizer).
		subscribe( function(result){
			console.log("In AdminPageComponent" + result);
		}, error => this.error = <any>error);
	}
	addInputForPlatoon(){
		this.platoons.push(new Platoon);
		console.log(JSON.stringify(this.platoons));
	}
	removeInputForPlatoon(){
		this.platoons.pop();
		console.log(JSON.stringify(this.platoons));
	}

}
