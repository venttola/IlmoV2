import { Component, OnInit, Input } from '@angular/core';

import { Event } from "../../event.model";
import { Platoon } from "../../platoon.model";
import { Organizer } from "../../organizer.model";
import { EventCreatorService } from "../event-creator.service";
@Component({
  selector: 'event-creator-component',
  templateUrl: './event-creator-component.component.html',
  styleUrls: ['./event-creator-component.component.css']
})
export class EventCreatorComponentComponent implements OnInit {

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
	trackPlatoon(index, item: Platoon){
		return item.name;
	}

}
