import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { AuthorizedHttpService } from "../authorizedhttp.service";
import { Http, Response } from "@angular/http";
import { ParticipantGroup } from "../event-details/participantgroup.model";
import { Member } from "./member";
import { Participant } from "./participant.model";
import { UserPayment } from "./userpayment";
import { Product } from "../event-signup/product";
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
    let data = {
      memberId: memberId,
    };

    return this.http.patch("/api/group/" + groupId + "/moderator", data, { headers: this.headers })
      .map((res: Response) => {
        console.log(res);
        return this.extractData(res).map(d => Member.fromJSON(d));
      }).catch(this.handleError);
  }

  removeModerator(groupId: number, memberId: number): Observable<Member[]> {
    return this.http.delete("/api/group/" + groupId + "/moderator/" + memberId + "/moderator", { headers: this.headers })
      .map((res: Response) => {
        console.log(res);
        return this.extractData(res).map(d => Member.fromJSON(d));
      }).catch(this.handleError);
  }

  //Service functions for managing the nonregistered Participants
  getParticipants(groupId: number): Observable<Participant[]> {
    console.log("GroupId: " + groupId);
    return this.http.get("/api/group/" + groupId + "/moderator/participants", { headers: this.headers })
      .map((res: Response) => {
        console.log(res);
        return this.extractData(res).map(data => { 
          let participant = Participant.fromJSON(data.participant);
          participant.payment = UserPayment.fromJSON(data.payment);
          return participant;

        });
      }).catch(this.handleError);
  }
  createParticipant(groupId: number, participant: Participant, products: Product[]): Observable<any> {
    let data = { groupId: groupId, participant: participant, products: products };

    return this.http.post("/api/group/" + groupId + "/moderator/participants", JSON.stringify(data), { headers: this.headers })
      .map((res:Response) => {
        console.log(res);
        return this.extractData(res);
       }).catch(this.handleError);
  }
  removeParticipant(groupId: number, participantId: number): Observable<any> {
    return this.http.delete("/api/group/" + groupId + "/moderator/participants/" + participantId, {headers: this.headers })
      .map((res: Response) => {
        return this.extractData(res).map(p => {
          let participant = Participant.fromJSON(p.participant);
          participant.payment = UserPayment.fromJSON(p.payment);
          return participant;
        });
      }).catch(this.handleError);
  }

  getAvailableProducts(groupId: number): Observable<Product[]> {
    return this.http.get("/api/group/" + groupId + "/moderator/products", { headers: this.headers})
    .map((res: Response) => {
       return this.extractData(res).map(product => Product.fromJSON(product));
    }).catch(this.handleError);
  }

  getParticipantPayments(groupId: number, participantId: number): Observable<UserPayment[]> {
    return this.http.get("/api/group/" + groupId + "/moderator/participantpayment/" + participantId, { headers: this.headers })
      .map((res: Response) => {
        console.log(res);
        return this.extractData(res).map(d => UserPayment.fromJSON(d));
      }).catch(this.handleError);
  }
}
