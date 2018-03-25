import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/forkJoin";


import { AuthorizedHttpService } from "../../authorizedhttp.service";

@Injectable()
export class AdminService extends AuthorizedHttpService {
	adminURL: string;	
	constructor(protected http: Http) {
		super (http);
		this.adminURL = "/api/admin" 
	}

	public getUsers(query: string): Observable<any>{
		let params = new URLSearchParams();
		params.set("search", query);
		return this.http.get(this.adminURL + "/users", { search: params, headers:this.headers }).
		map(this.extractData).
		catch(this.handleError);
	}
	public resetUserPassword(user: string, password: string, rePassword: string): Observable<any>{
		let passwords = {password: password, rePassword: rePassword};
		return this.http.patch(this.adminURL + "/users/resetpassword/" + user, JSON.stringify(passwords), {headers: this.headers}).
		map(this.extractData).
		catch(this.handleError);
	}
}
