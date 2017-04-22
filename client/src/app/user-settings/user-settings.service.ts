import { Injectable } from '@angular/core';
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { UserData } from "./userdata.model";
const URL_BASE = "http://localhost:8080/api/";
const USERS_URL = URL_BASE + "user/";
@Injectable()
export class UserSettingsService {

	headers: Headers;
	constructor(private http: Http) {
		this.headers = new Headers({ "Content-Type": "application/json" });
		this.headers.append('Authorization', 'Bearer ' + localStorage.getItem("id_token"));
	}
	getUserData(): Observable<UserData>{
		console.log(localStorage.getItem("user"));
		let response: any = this.http.get(USERS_URL+ localStorage.getItem("user"), { headers: this.headers }).map(this.extractData).catch(this.handleError);
		return (response);
	}
	sendUpdate(): void{
		console.log("foo");
	}

	private extractData(res: Response){
		let body = res.json();
		console.log(body);
		return body || {};
	}
	private handleError(error: any): Promise<any> {
		console.error("An error occurred", error);
		return Promise.reject(error.message || error);
	}
}
