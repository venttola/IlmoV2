import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { AuthorizedHttpService } from "../authorizedhttp.service";
import { Http, Response } from "@angular/http";
import { ParticipantGroup } from "../event-details/participantgroup.model";

@Injectable()
export class GroupModerationService extends AuthorizedHttpService {

  constructor(protected http: Http) {
    super(http);
  }

  getModeratedGroups(): Observable<ParticipantGroup[]> {
    let username = localStorage.getItem("user");

    return this.http.get("/api/group/" + username + "/moderation", { headers: this.headers })
      .map((res: Response) =>
        this.extractData(res).map(d => ParticipantGroup.fromJSON(d))
      )
      .catch(this.handleError);
  }
}
