import { Injectable } from '@angular/core';
import { Http } from "@angular/http";

import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { AuthorizedHttpService } from "../../authorizedhttp.service";
import { CredentialUpdate } from "./credentialupdate.model";

@Injectable()
export class PasswordChangeService extends AuthorizedHttpService {
    usersUrl: string;
	constructor(protected http: Http) {
		super(http);
		this.usersUrl = "/api/user/";
	}

	updatePassword(data: CredentialUpdate): Observable<any> {
		data.email = localStorage.getItem("user");
		console.log(this.usersUrl + localStorage.getItem("user") + "/credentials");
		return this.http.patch(this.usersUrl + localStorage.getItem("user") + "/credentials",
							   JSON.stringify(data),
							   {headers:this.headers}).map(this.extractData).catch(this.handleError);
	}
}
