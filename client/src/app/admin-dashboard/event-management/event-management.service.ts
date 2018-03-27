import { Injectable } from '@angular/core';

import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/forkJoin";

import { AuthorizedHttpService } from "../../authorizedhttp.service";
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
	public updateEvent(event: Event, platoons: Platoon[], products: Product[]): Observable<any> {
		return  Observable.forkJoin(
				 products.map(product => {
				 	if (product.id){
				 		console.log("Old product" + product);
						return this.updateProduct(event.id, product);
					} else {
						console.log("New Product" + product);
						return this.updateProduct(event.id, product);
					}
				}));
	}
	public updateProduct(eventId: number, product: Product): Observable<Product> {
		console.log("Updating product " + product);
		return this.http.patch(this.eventsUrl + eventId +"/product", JSON.stringify(product), {headers: this.headers}).catch(this.handleError);
	}
	//DO NOT use this for any other thing than updatinf ref numbers for Sotahuuto 2017
	public generateReferenceNumbers(): Observable<any>{
		console.log("Generating refs...");
		return this.http.patch("/api/admin/generatereferencenumbers", {}, {headers: this.headers}).
		catch(this.handleError);
	}

}
