import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { AuthorizedHttpService } from "../authorizedhttp.service";
import { ParticipantGroup } from "./participantgroup.model";

@Injectable()
export class ParticipantGroupService extends AuthorizedHttpService {
	groupUrl: string
	constructor(protected http: Http) {
		super(http);
		this.groupUrl = "/api/group/"
	}
	// public getEventGroups(data: any): Observable <any> {

	// }
	// public joinGroup(data: any): Observable <any> {

	// }
	public createGroup(data: any): Observable<any> {
		return this.http.post(this.groupUrl, data, { headers: this.headers }).
			map(this.extractData).
			catch(this.handleError);
	}

	public getGroup(groupId: number): Observable<ParticipantGroup> {
		return this.http.get(this.groupUrl + groupId, { headers: this.headers })
			.map((res: Response) => {
				let data = this.extractData(res);
				return ParticipantGroup.fromJSON(data);
			})
			.catch(err => this.handleError(err));
	}
}
