import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/forkJoin";


import { Credentials } from "./credentials.model";
import { AuthService } from "../authentication/auth.service";

@Injectable()
export class LoginService{
	headers : Headers;
	credentials: Credentials;

	constructor(private http: Http){
		this.headers =  new Headers( {"Content-Type": "application/json"});
	}

	public sendLoginRequest(credentials: Credentials): Observable<any> {
		this.credentials = credentials;
		return this.http.post("/api/login", JSON.stringify(credentials), { headers: this.headers }).
		map(this.handleLogin).
		catch(this.handleError);
	}
	private handleLogin(res: Response): any {
		return JSON.parse(res.json());
	}
	private handleError(error: any): Observable<any> {
		console.error("An error occurred", error);
		return Observable.throw(error.message || error);
	}

}