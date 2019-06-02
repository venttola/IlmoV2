import { Injectable } from '@angular/core';
import { AuthorizedHttpService } from "../../shared/authorizedhttp.service";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Product } from "../shared/product.model";

import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { SignupData } from "./signup-data.model";

@Injectable()
export class EventSignupService extends AuthorizedHttpService {

	constructor(protected http: Http) {
		super(http);
	}

	public getSignupData(groupId: number, eventId: number): Observable<SignupData> {
		let username = localStorage.getItem("user");
		let data = {
			"groupId": groupId,
			"eventId": eventId
		};

		return this.http.post("/api/user/" + username + "/event/data", data, { headers: this.headers })
			.map((res: Response) => {
				let body = res.json();
				return SignupData.fromJSON(body);
			})
			.catch(err => this.handleError(err));
	}

	public saveSignup(groupId: number, products: any[]) {
		let username = localStorage.getItem("user");

		let data = {
			"groupId": groupId,
			"products": products
		}

		console.log("Data:" + JSON.stringify(data));

		return this.http.post("/api/user/" + username + "/event/signup", JSON.stringify(data), { headers: this.headers })
			.map((res: Response) => {
				return res.status === 204;
			})
			.catch(err => this.handleError(err));
	}

	public cancelSignup(groupId: number): Observable<boolean> {
		let username = localStorage.getItem("user");
		return this.http.delete("/api/user/" + username + "/event/group/" + groupId, { headers: this.headers })
			.map((res: Response) => res.status == 204)
			.catch(err => this.handleError(err));
	}
}
