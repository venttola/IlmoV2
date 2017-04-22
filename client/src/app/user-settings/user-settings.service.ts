import { Injectable } from '@angular/core';
import { Http} from "@angular/http";

import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { AuthorizedHttpService } from "../authorizedhttp.service";
import { UserData } from "./userdata.model";
@Injectable()
export class UserSettingsService extends AuthorizedHttpService {
    usersUrl: string;
	constructor(protected http: Http) {
		super(http);
		this.usersUrl = this.urlBase +"user/";
	}
	getUserData(): Observable<UserData>{
		console.log(localStorage.getItem("user"));
		let response: any = this.http.get(this.usersUrl+ localStorage.getItem("user"), { headers: this.headers }).map(this.extractData).catch(this.handleError);
		return (response);
	}
}
