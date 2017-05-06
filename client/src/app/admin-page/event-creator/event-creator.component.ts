import { Component, OnInit, Input } from '@angular/core';

import { Event } from "../../event.model";
import { Platoon } from "../../platoon.model";
import { Organization } from "../../organization.model";
import { EventCreatorService } from "../event-creator.service";

@Component({
  selector: 'event-creator-component',
  templateUrl: './event-creator.component.html',
  styleUrls: ['./event-creator.component.css']
})
export class EventCreatorComponent implements OnInit {

  	@Input() newEvent: Event;
	@Input() platoons: Platoon[];
	@Input() organization: Organization;
	result: any;
	error: any;
	constructor(private eventCreatorService: EventCreatorService) { 
		this.newEvent = new Event;
		this.platoons = new Array<Platoon>();
		this.organization = new Organization;
	}
	ngOnInit() {
	}
	createEvent(){
		this.eventCreatorService.createEvent(this.newEvent, this.platoons, this.organization).
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
	trackPlatoon(index: number, platoon: Platoon): string{
		return platoon.name;
	}

}
