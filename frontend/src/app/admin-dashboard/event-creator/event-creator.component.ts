import { Component, OnInit, Input } from '@angular/core';

import { Event } from "../../events/shared/event.model";
import { Platoon } from "../../events/shared/platoon.model";
import { Organization } from "../../shared/organization.model";
import { Product } from "../../events/shared/product.model";
import { Discount } from "../../events/shared/discount.model";

import { EventCreatorService } from "./event-creator.service";

@Component({
  selector: 'admin-event-creator-component',
  templateUrl: './event-creator.component.html',
  styleUrls: ['./event-creator.component.css']
})
export class EventCreatorComponent implements OnInit {

  @Input() newEvent: Event;
	@Input() platoons: Platoon[];
	@Input() organization: Organization;
	@Input () products: Product[];
	testProducts: Product[];
	result: any;
	error: any;
	constructor(private eventCreatorService: EventCreatorService) { 
		this.newEvent = new Event;
		this.platoons = new Array<Platoon>();
		this.organization = new Organization;
		this.products = new Array<Product>();
		this.testProducts = new Array<Product>();
	}
	ngOnInit() {
	}
	createEvent(){
		this.eventCreatorService.createEvent(this.newEvent, this.platoons, this.organization, this.products).
		subscribe( function(result){
			console.log("In AdminPageComponent");
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
	addInputForProduct(){
		this.products.push(new Product);
	}
	removeInputForProduct(){
		this.products.pop();
	}
	trackProduct(index: number, product: Product): string{
		return product.name;
	}
	addProduct(){
		this.eventCreatorService.addProduct(52, this.products[0]).subscribe(
			function(result){
				console.log(result);
				this.testProducts = result;

			})
	}
}
