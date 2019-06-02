import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/forkJoin";

import { Event } from "../../events/shared/event.model";
import { AuthorizedHttpService } from "../../shared/authorizedhttp.service";

@Injectable()
export class EventListingService extends AuthorizedHttpService {
  constructor(protected http: Http) {
    super (http);
  }
  getEvents(organizationId: number): Observable<Event[]> {
    return this.http.get("/api/organization/" + organizationId + "/events", { headers: this.headers }).map(this.extractData).catch(this.handleError);
  }
  protected extractData(res: Response): Event[] {
    let body = res.json();
    let eventList = new Array<Event>();
    for (let event of body) {
      eventList.push(Event.fromJSON(event));
    }
    return eventList;
  }
}