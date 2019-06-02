import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
//import { Observable } from "rxjs/Observable";
import { Observable} from "rxjs";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { catchError, retry } from 'rxjs/operators';
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { SignupData } from "./signupdata.model";
import { UserData } from "./user-data.model";

@Injectable()
export class SignupService {
	headers: Headers;
	constructor(private http: Http) {
		this.headers = new Headers({ "Content-Type": "application/json" });
	}

	public sendSignupRequest(signup: SignupData): Observable<UserData> {
		return this.http.post("/api/signup", JSON.stringify(signup), { headers: this.headers }).
			map(this.handleSignup).pipe(
      catchError(this.handleError)
    );
	}
	private handleSignup(res: Response): UserData{
		return JSON.parse(res.json());
	}
	private handleError(error: HttpErrorResponse){
		 if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  	} else {
			console.error("An error occurred", error);
      let errorMessage = "";
      if(error.status === 400 ){
        errorMessage = "Syöttämissäsi tiedoissa on virhe.";
      } else if (error.status === 409){
        errorMessage = "Käyttäjänimi on jo käytössä.";
      } else {
        errorMessage = "Tuntematon virhe.";          
      }
  	  return new ErrorObservable(errorMessage);
  	}
	}

}