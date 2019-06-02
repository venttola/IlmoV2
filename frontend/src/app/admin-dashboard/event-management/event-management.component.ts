import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";

import { Event } from "../../events/shared/event.model";
import { Platoon } from "../../events/shared/platoon.model";
import { ParticipantGroup } from "../../events/shared/participantgroup.model";
import { EventDetails } from "../../events/event-details/event-details.model";

import { Product } from "../../events/shared/product.model";
import { Discount } from "../../events/shared/discount.model";
import { EventService } from "../../events/shared/event.service";

import { EventDetailsService } from "../../events/event-details/event-details.service";
import { EventManagementService } from "./event-management.service";

@Component({
	selector: 'admin-event-management',
	templateUrl: './event-management.component.html',
	styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {
	event: Event;
	eventDetails: EventDetails;
	eventPlatoons: Platoon[];
	newPlatoons: Platoon[];
	eventProducts: Product[];
	newProducts: Product[];
	private groupsByPlatoon: Map<number, ParticipantGroup[]> = new Map<number, ParticipantGroup[]>();
	error: any;
	constructor( private route: ActivatedRoute,
				 private eventManagementService: EventManagementService,
				 private eventDetailsService: EventDetailsService ) {
		this.event = new Event();
		this.eventPlatoons = new Array<Platoon>();
		this.newPlatoons = new Array<Platoon>();
		this.eventProducts = new Array<Product>();
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
			//console.log(eventDetails);
			this.eventDetails = eventDetails;
			this.event = eventDetails.event;
			this.eventPlatoons = eventDetails.platoonList;
			eventDetails.platoonList.map(p => this.groupsByPlatoon.set(p.id, p.participantGroups));
		},
		error => this.error = <any>error);
	}
	public getEventProducts (){
		this.route.params.
		switchMap((params: Params) => this.eventDetailsService.getEventProducts(+params["eventId"])).
		subscribe((products: Product[]) => {
			console.log(products);
			this.eventProducts = products;
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
		console.log(this.eventProducts);
		console.log("foo");
		this.eventManagementService.updateEvent(this.event, 
																						this.eventPlatoons, 
																						this.eventProducts,
																						this.newPlatoons,
																						this.newProducts)
		  .subscribe((result: any) => {
		  	console.log(result);

		  }, error => this.error = <any>error);
	}
	addInputForPlatoon(){
		this.newPlatoons.push(new Platoon);
		//console.log(JSON.stringify(this.eventPlatoons));
	}
	removeInputForPlatoon(){
		this.newPlatoons.pop();
		//console.log(JSON.stringify(this.eventDetails.platoonList));
	}
	trackPlatoon(index: number, platoon: Platoon): string{
		return platoon.name;
	}
	addInputForProduct(){
		let product = new Product;
		product.discounts = new Array<Discount>();
		this.newProducts.push(product);
	}
	removeInputForProduct(){
		this.newProducts.pop();
	}
	trackProduct(index: number, product: Product): string{
		return product.name;
	}
	addInputForDiscount(product: Product){
		product.discounts.push(new Discount);
	}
	removeInputForDiscount(product: Product){
		product.discounts.pop();
	}
	trackDiscount(index: number, discount: Discount): string{
		return discount.name;
	}
}
