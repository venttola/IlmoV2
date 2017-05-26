import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { Event } from "../../event.model";
import { Platoon } from "../../event-details/platoon.model";
import { ParticipantGroup } from "../../event-details/participantgroup.model";
import { EventDetails } from "../../event-details/event-details.model";

import { Product } from "../../event-signup/product";
import { Discount } from "../../event-signup/discount";
import { EventService } from "../../event.service";
import { EventDetailsService } from "../../event-details/event-details.service";
import { EventManagementService } from "./event-management.service";
@Component({
	selector: 'event-management',
	templateUrl: './event-management.component.html',
	styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {
	event: Event;
	eventDetails: EventDetails;
	newPlatoons: Platoon[];
	newProducts: Product[];

	private groupsByPlatoon: Map<number, ParticipantGroup[]> = new Map<number, ParticipantGroup[]>();
	error: any;
	constructor( private route: ActivatedRoute,
				 private eventManagementService: EventManagementService,
				 private eventDetailsService: EventDetailsService ) {
		this.event = new Event();
		this.newPlatoons = new Array<Platoon>();
		this.newProducts = new Array<Product>();
	}

	ngOnInit() {
		this.getEventDetais();
		this.getEventProducts();
		
	}
	public getEventDetais(){
		this.route.params
		.switchMap((params: Params) => this.eventDetailsService.getEventDetails(+params["eventId"]))
		.subscribe((eventDetails: EventDetails) => {
			console.log(eventDetails);
			this.eventDetails = eventDetails;
			this.event = eventDetails.event;
			this.newPlatoons = eventDetails.platoonList;
			eventDetails.platoonList.map(p => this.groupsByPlatoon.set(p.id, p.participantGroups));
		},
		error => this.error = <any>error);
	}
	public getEventProducts (){
		this.route.params.
		switchMap((params: Params) => this.eventDetailsService.getEventProducts(+params["eventId"])).
		subscribe((products: Product[]) => {
			console.log(products);
			this.newProducts = products;
		},
		error => this.error =<any>error);
	}
	public openSignup(){
		this.route.params.
		switchMap((params: Params) => this.eventManagementService.openSignup(+params["eventId"])).
		subscribe((result: any) => {
			this.event.registerationOpen = result;
			console.log(result);
			//this.event.registerationOpen = isOpen;
		},
		error => this.error =<any>error);

	}
	public closeSignup(){
		this.route.params.
		switchMap((params: Params) => this.eventManagementService.closeSignup(+params["eventId"])).
		subscribe((result: any) => {
			this.event.registerationOpen = result.registerationOpen;
			console.log(result);
			//this.event.registerationOpen = isOpen;
		},
		error => this.error =<any>error);

	}
	updateEvent(){
		console.log(this.eventDetails);
		console.log("foo");
	}
	addInputForPlatoon(){
		this.eventDetails.platoonList.push(new Platoon);
		console.log(JSON.stringify(this.newPlatoons));
	}
	removeInputForPlatoon(){
		this.eventDetails.platoonList.pop();
		console.log(JSON.stringify(this.eventDetails.platoonList));
	}
	trackPlatoon(index: number, platoon: Platoon): string{
		return platoon.name;
	}
	addInputForProduct(){
		this.newProducts.push(new Product);
	}
	removeInputForProduct(){
		this.newProducts.pop();
	}
}
