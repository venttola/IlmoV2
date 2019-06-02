import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { AuthorizedHttpService } from "../../shared/authorizedhttp.service";

import { EventDetails } from "./event-details.model";
import { Product } from "../shared/product.model";
@Injectable()
export class EventDetailsService extends AuthorizedHttpService {
	eventUrl: string;

	constructor(protected http: Http) {
		super(http);
		this.eventUrl = "/api/events/";
	}

	public getEventDetails(id: number): Observable<EventDetails> {
		return this.http.get(this.eventUrl + id, { headers: this.headers })
		.map(this.extractData).
		catch(this.handleError);
	}

	public getEventProducts(id: number): Observable<Product[]> {
		console.log("Getting products");
		console.log(this.eventUrl + id + "/product");
		return this.http.get(this.eventUrl + id + "/product", { headers: this.headers })
		.map((res: Response) => {
			return res.json().map(d => Product.fromJSON(d));
		})
		.catch(err => this.handleError(err));
	}

	protected extractData(res: Response) {
		let body = res.json();
		let eventDetails = new EventDetails(body.data);
		console.log(eventDetails);
		return eventDetails;
	}
}
