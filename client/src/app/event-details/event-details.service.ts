import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { EventDetails } from "./event-details.model";

import { AuthorizedHttpService } from "../authorizedhttp.service";
@Injectable()
export class EventDetailsService extends AuthorizedHttpService {
	eventUrl: string;

	constructor(protected http: Http) {
		super(http);
		this.eventUrl = this.urlBase + "events/";
	}

	public getEventDetails(id: number): Observable<EventDetails> {
		return this.http.get(this.eventUrl + id, { headers: this.headers }).
			map(this.extractData).
			catch(this.handleError);
	}
	
	protected extractData(res: Response) {
		let body = res.json();
		let eventDetails = new EventDetails(body.data);
		console.log(eventDetails);
		return eventDetails;
	}

}
