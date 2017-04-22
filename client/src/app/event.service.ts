import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { Event } from "./event-model";
import { AuthorizedHttpService } from "./authorizedhttp.service";

import { AuthService } from "./authentication/auth.service";

@Injectable()
export class EventService extends AuthorizedHttpService {
  eventsUrl: string;
  constructor(protected http: Http) {
    super(http);
    this.eventsUrl = this.urlBase + "events";
  }

  getEventListing(): Observable<Event[]>{
  	let response: any = this.http.get(this.eventsUrl, { headers: this.headers }).map(this.extractData).catch(this.handleError);
  	return (response);
  }
  
}
