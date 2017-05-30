import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { SignupData } from "./signupdata.model";
import { UserData } from "./user-data.model";

const signupURL = "http://localhost:8080/api/signup";
@Injectable()
export class SignupService {
	headers: Headers;
	constructor(private http: Http) {
		this.headers = new Headers({ "Content-Type": "application/json" });
	}

	public sendSignupRequest(signup: SignupData): Observable<UserData> {
		return this.http.post(signupURL, JSON.stringify(signup), { headers: this.headers }).
			map(this.handleSignup).
			catch(this.handleError);
	}
	private handleSignup(res: Response): UserData{
		return JSON.parse(res.json());
	}
	private handleError(error: any): Observable<any> {
		console.error("An error occurred", error);
		return Observable.throw(error.message || error);
	}

}