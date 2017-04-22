import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import "rxjs/add/operator/toPromise";


import { Credentials } from "./credentials.model";
import { AuthService } from "../authentication/auth.service";

const loginURL = "http://localhost:8080/api/login";

@Injectable()
export class LoginService{
	headers : Headers;

	constructor(private http: Http,
				private authService: AuthService){
		this.headers =  new Headers( {"Content-Type": "application/json"});
	}

	public sendLoginRequest(credentials: Credentials): Promise<JSON> {
		//console.log(JSON.stringify(credentials));
		credentials.encodePassword();
		return this.
			   http.
			   post(loginURL,
			   		JSON.stringify(credentials),
			   		{ headers: this.headers }).
			   toPromise().
			   then(response => {
			   	let responseJSON : any = JSON.parse(response.json());
			   	let token : any = responseJSON.token;
			   	console.log (responseJSON.token);
			   	this.authService.saveToken(credentials.email, token);

			   	}).
			   catch(this.handleError);
	}
	 private handleError(error: any): Promise<any> {
        console.error("An error occurred", error);
        return Promise.reject(error.message || error);
    }

}