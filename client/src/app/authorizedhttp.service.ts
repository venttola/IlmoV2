import { Injectable } from '@angular/core';
import { Http, Response, Headers} from "@angular/http";


@Injectable()
export class AuthorizedHttpService {
	protected urlBase;
	protected headers: Headers;
	constructor(protected http: Http) {
		this.headers = new Headers( {"Content-Type": "application/json" });
		this.headers.append('Authorization', 'Bearer ' + localStorage.getItem("id_token"));
		this.urlBase = "http://localhost:8080/api/";
	}
	protected extractData(res: Response){
		let body = res.json();
		return body || {};
	}
	protected handleError(error: any): Promise<any> {
		console.error("An error occurred", error);
		return Promise.reject(error.message || error);
	}

}
