import { Injectable } from '@angular/core';
import { Http } from "@angular/http";

import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { AuthorizedHttpService } from "../authorizedhttp.service";
import { UserData } from "./userdata.model";
import { CredentialUpdate } from "./credentialupdate.model";

@Injectable()
export class UserSettingsService extends AuthorizedHttpService {
    usersUrl: string;
	constructor(protected http: Http) {
		super(http);
		this.usersUrl = this.urlBase +"user/";
	}
	getUserData(): Observable<UserData>{
		console.log(this.usersUrl + localStorage.getItem("user"));
		let response: any = this.http.get(this.usersUrl + localStorage.getItem("user"), { headers: this.headers }).map(this.extractData).catch(this.handleError);
		return (response);
	}
	updateUserData(data: UserData): Observable<any> {
		console.log(this.usersUrl + localStorage.getItem("user") + "/detail");
		return this.http.patch(this.usersUrl + localStorage.getItem("user") + "/detail",
							   JSON.stringify(data),
							   {headers:this.headers}).map(this.extractData).catch(this.handleError); 

	}
	updatePassword(data: CredentialUpdate): Observable<any> {
		data.email = localStorage.getItem("user");
		console.log(this.usersUrl + localStorage.getItem("user") + "/credentials");
		return this.http.patch(this.usersUrl + localStorage.getItem("user") + "/credentials",
							   JSON.stringify(data),
							   {headers:this.headers}).map(this.extractData).catch(this.handleError);
	}
}
