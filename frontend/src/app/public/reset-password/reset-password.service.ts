import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { ResetPasswordModel } from "./reset-password.model";

@Injectable()
export class ResetPasswordService {

  headers : Headers;
  constructor(protected http: Http) {
    this.headers =  new Headers( {"Content-Type": "application/json"});
  }
  public resetPassword(resetPasswordData: ResetPasswordModel, token: string){
  	let body = {
  			     password: resetPasswordData.password,
  			     verifyPassword: resetPasswordData.verifyPassword,
  			     token: token
  			   };
  	return this.http.post("/api/resetpassword", JSON.stringify(body), { headers: this.headers })
		.catch(this.handleError);

  }
  private handleError(error: any): Observable<any> {
		console.error("An error occurred", error);
		return Observable.throw(error.message || error);
	}
}
