import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { AuthorizedHttpService } from "../authorizedhttp.service";
import { Http, Response } from "@angular/http";
import { ParticipantGroup } from "../event-details/participantgroup.model";
import { Member } from "./member";
import { UserPayment } from "./userpayment";

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
      ).catch(this.handleError);
  }

  getGroupMembers(groupId: number): Observable<Member[]> {
    console.log("GroupId: " + groupId);
    return this.http.get("/api/group/" + groupId + "/moderator/members", { headers: this.headers })
      .map((res: Response) => {
        console.log(res);
        return this.extractData(res).map(d => Member.fromJSON(d));
      }).catch(this.handleError);
  }

  getMemberPayments(groupId: number, memberId: number): Observable<UserPayment[]> {
    return this.http.get("/api/group/" + groupId + "/moderator/userpayment/" + memberId, { headers: this.headers })
      .map((res: Response) => {
        console.log(res);
        return this.extractData(res).map(d => UserPayment.fromJSON(d));
      }).catch(this.handleError);
  }

  removeMember(groupId: number, memberId: number): Observable<Member[]> {
    return this.http.delete("/api/group/" + groupId + "/moderator/" + memberId, { headers: this.headers })
      .map((res: Response) => {
        return this.extractData(res).map(d => Member.fromJSON(d));
      }).catch(this.handleError);
  }

  receiptPayment(groupId: number, memberId: number): Observable<UserPayment[]> {
    let data = {
      groupId: groupId,
      memberId: memberId,
    };

    return this.http.post("/api/group/" + groupId + "/moderator/userpayment", data, { headers: this.headers })
      .map((res: Response) => {
        console.log(res);
        return this.extractData(res).map(d => UserPayment.fromJSON(d));
      }).catch(this.handleError);
  }

  addModerator(groupId: number, memberId: number): Observable<Member[]> {
    return null;
  }
}
