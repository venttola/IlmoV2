import { Injectable } from '@angular/core';

import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/forkJoin";
import { merge } from 'rxjs/observable/merge';

import { AuthorizedHttpService } from "../../shared/authorizedhttp.service";
import { EventCreatorService } from "../event-creator/event-creator.service";

import { Platoon } from "../../events/shared/platoon.model";
import { Organization } from "../../shared/organization.model";
import { Event } from "../../events/shared/event.model";
import { Product } from "../../events/shared/product.model";
import { Discount } from "../../events/shared/discount.model";

@Injectable()
export class EventManagementService extends AuthorizedHttpService {
	eventsUrl: string;
	constructor(protected http: Http,
							private eventCreatorService: EventCreatorService) {
		super(http);
		this.eventsUrl = "/api/events/";
	}

	public openSignup(eventId: number): Observable<boolean> {
		return this.http.post(this.eventsUrl + eventId + "/opensignup", {}, {headers: this.headers}).
		map(this.extractData).
		catch(this.handleError);
	}

	public closeSignup(eventId: number): Observable<boolean> {
		return this.http.post(this.eventsUrl + eventId + "/closesignup", {}, {headers: this.headers}).
		map(this.extractData).
		catch(this.handleError);
	}
	//
	public updateEvent(event: Event, 
										 eventPlatoons: Platoon[], 
										 eventProducts: Product[],
										 newPlatoons: Platoon[], 
										 newProducts: Product[]): Observable<any> {
		let updatedProducts = Observable.forkJoin(
				 eventProducts.map(product => {
						return this.updateProduct(event.id, product);
				}));
		let updatedPlatoons = Observable.forkJoin(
				 eventPlatoons.map(platoon => {
						return this.updatePlatoon(event.id, platoon);
				}));
		let addedProducts = Observable.forkJoin(
				newProducts.map(product =>{
					return this.eventCreatorService.addProduct(event.id, product);
				}));
		let addedPlatoons = this.eventCreatorService.addPlatoons(event.id, newPlatoons);
		return merge(updatedProducts, updatedPlatoons, addedProducts, addedPlatoons);
	}
	public updateProduct(eventId: number, product: Product): Observable<Product> {
		//console.log("Updating product " + product.id + " " + product.name);
		return this.http.patch(this.eventsUrl + eventId +"/product", JSON.stringify(product), {headers: this.headers}).catch(this.handleError);
	}
	public updatePlatoon(eventId: number, platoon: Platoon): Observable<Platoon> {
		//console.log("Updading platoon" + platoon.name);
			return this.http.patch(this.eventsUrl + eventId + "/platoon", JSON.stringify(platoon), {headers: this.headers}).catch(this.handleError);
		}
	}

}
