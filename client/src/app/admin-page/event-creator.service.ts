import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { Event } from "../event-model";
import { AuthorizedHttpService } from "../authorizedhttp.service";

@Injectable()
export class EventCreatorService extends AuthorizedHttpService {
	eventsUrl: string;
	constructor(protected http: Http) {
		super(http);
		this.eventsUrl = this.urlBase + "events";
	}

	public createEvent(data: Event): Observable<any> {
		return 	this.http.post(this.eventsUrl, JSON.stringify(data), {headers: this.headers}).
				map(this.extractData).
				catch(this.handleError);
	}
}
