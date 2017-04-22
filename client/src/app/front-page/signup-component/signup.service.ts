import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/add/operator/toPromise';

import { SignupData } from "./signupdata.model";

const signupURL = "http://localhost:8080/api/signup";
@Injectable()
export class SignupService {
	headers: Headers;
	constructor(private http: Http) {
		this.headers = new Headers({ "Content-Type": "application/json" });
	}

	public sendSignupRequest(signup: SignupData): Promise<JSON> {
		signup.encodePassword();
		return this.
			http.
			post(signupURL,
			JSON.stringify(signup),
			{ headers: this.headers }).
			toPromise().
			catch(this.handleError);
	}
	private handleError(error: any): Promise<any> {
		console.error("An error occurred", error);
		return Promise.reject(error.message || error);
	}

}