import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { AuthorizedHttpService } from "../authorizedhttp.service";

@Injectable()
export class ParticipantGroupService extends AuthorizedHttpService {
	groupUrl: string
	constructor(protected http: Http) {
		super(http);
		this.groupUrl = this.urlBase + "/group"
	}
	public getEventGroups(data: any): Observable <any> {

	}
	public joinGroup(data: any): Observable <any> {

	}
	public createGroup(data: any): Observable <any> {
		return this.http.post(this.groupUrl, data, {headers: this.headers}).
			   map(this.extractData).
			   catch(this.handleError);
	}

}
