import { Injectable } from '@angular/core';

import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/forkJoin";

import { Platoon } from "../../platoon.model";
import { Organization } from "../../organization.model";
import { Event } from "../../event.model";
import { AuthorizedHttpService } from "../../authorizedhttp.service";
@Injectable()
export class EventManagementService extends AuthorizedHttpService {
	eventsUrl: string;
	constructor(protected http: Http) {
		super(http);
		this.eventsUrl = this.urlBase + "events/";
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

}
