import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { Event } from "./event.model";
import { AuthorizedHttpService } from "./authorizedhttp.service";

import { AuthService } from "./authentication/auth.service";
import { ParticipantGroup } from "./event-details/participantgroup.model";
import { Platoon } from "./event-details/platoon.model";

@Injectable()
export class EventService extends AuthorizedHttpService {
  eventsUrl: string;
  constructor(protected http: Http) {
    super(http);
    this.eventsUrl = this.urlBase + "events";
  }

  getEventListing(): Observable<Event[]> {
    return this.http.get(this.eventsUrl, { headers: this.headers }).map(this.extractData).catch(this.handleError);
  }

  createGroup(group: ParticipantGroup, eventId: number): Observable<ParticipantGroup> {
    let username = localStorage.getItem("user");
    
    let data = {
      moderator: username,
      group: group
    };

    return this.http.post(`${this.eventsUrl}/${eventId}/group`, JSON.stringify(data), { headers: this.headers })
      .map((r: Response) => ParticipantGroup.fromJSON(r.json()))
      .catch(this.handleError);
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
