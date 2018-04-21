import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable()
export class PasswordResetService  {
  headers : Headers;
  constructor(protected http: Http) {
  	this.headers =  new Headers( {"Content-Type": "application/json"});
   }
  sendResetRequest(userEmail: string): Observable<any>{
  	let body = {email: userEmail};
  	return this.http.post("/api/forgotpassword/", JSON.stringify(body), { headers: this.headers })
		.catch(this.handleError);

  }
  private handleError(error: any): Observable<any> {
		console.error("An error occurred", error);
		return Observable.throw(error.message || error);
	}

}
