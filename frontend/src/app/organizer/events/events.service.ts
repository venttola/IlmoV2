import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from 'rxjs/Observable'

import { AuthorizedHttpService } from "../../shared/authorizedhttp.service";
import { Event } from "../../events/shared/event.model";

@Injectable()
export class EventsService extends AuthorizedHttpService {
  constructor(protected http: Http) {
    super (http);
  }
  getEventOverview(organizationId: number, eventId: number): Observable<any>{
    return this.http.get("/api/organization/" + organizationId + "/event/" + eventId, { headers: this.headers })
    .map(this.extractData)
    .catch(this.handleError);
  }
  getGroupListing(organizationId: number, eventId: number): Observable<any>{
    return this.http.get("/api/organization/" + organizationId + "/event/" + eventId + "/groups", { headers: this.headers })
    .map(this.extractData)
    .catch(this.handleError);
  }
 
}
