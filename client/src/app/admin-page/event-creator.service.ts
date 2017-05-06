import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/forkJoin";

import { Platoon } from "../platoon.model";
import { Organization } from "../organization.model";
import { Event } from "../event.model";
import { AuthorizedHttpService } from "../authorizedhttp.service";

@Injectable()
export class EventCreatorService extends AuthorizedHttpService {
	eventsUrl: string;
	resultEvent: Event;
	constructor(protected http: Http) {
		super(http);
		this.eventsUrl = this.urlBase + "events/";
	}

	public createEvent(event: Event, platoons: Platoon[], organization: Organization): Observable<any> {
		return this.http.post(this.eventsUrl, JSON.stringify(event), {headers: this.headers}).
		map(this.extractEventData).
		flatMap((resultEvent) => {

			console.log("do we even get here. id is " + resultEvent.id);
			let resultPlatoons = this.addPlatoons(resultEvent.id, platoons);
			let resultOrganization = this.setOrganization(resultEvent.id, organization);
			console.log("Platoons result");
			console.log(resultPlatoons);
			return Observable.forkJoin(resultPlatoons, resultOrganization);
		}).
		catch(this.handleError);

	}
	public addPlatoons(eventId: number, platoons: Platoon[]): Observable <any>{
		console.log(this.eventsUrl + eventId + "/platoons");
		console.log(JSON.stringify(platoons));
		return this.http.post(this.eventsUrl + eventId + "/platoons", JSON.stringify({platoons: platoons}), {headers: this.headers}).
		map( this.extractPlatoonData).
		catch(this.handleError);

	}
	public setOrganization (eventId: number, organization: Organization): Observable<any>{
		return this.http.post(this.eventsUrl + eventId + "/organization", JSON.stringify(organization), {headers: this.headers}).
		map(this.extractOrganizationData).
		catch(this.handleError);
	}
	protected extractEventData(res: Response): Event{
		let body = res.json();
		console.log("Extract eventData" + body);
		return Event.fromJSON(body.data.event);
	}
	protected extractPlatoonData(res: Response){
		let body = res.json();
		console.log("Extract platoonData" + body);
		let platoons = body.platoons;
		let platoonList = new Array<Platoon>();
		for (let platoon of platoons){
			platoonList.push(Platoon.fromJSON(platoon));
		}
		return platoonList;
	}
	protected extractOrganizationData(res: Response): Organization{
		let body = res.json();
		console.log("Extract eventData" + body);
		return Organization.fromJSON(body.data.event);
	}
}
