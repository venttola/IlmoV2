import { Injectable } from '@angular/core';
import { Http, Response, Headers} from "@angular/http";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { Observable } from "rxjs/Observable";

@Injectable()
export class AuthorizedHttpService {
	protected headers: Headers;
	constructor(protected http: Http) {
		this.headers = new Headers( {"Content-Type": "application/json" });
		this.headers.append('Authorization', 'Bearer ' + localStorage.getItem("id_token"));
	}
	
	protected extractData(res: Response){
		let body = res.json();
		return body || {};
	}

	protected handleError(error: HttpErrorResponse): Observable<any> {
		console.error("An error occurred", error);
		return new ErrorObservable(error.message);
	}

}
