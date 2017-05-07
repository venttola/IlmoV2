import { Injectable } from '@angular/core';
import { AuthorizedHttpService } from "../authorizedhttp.service";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Product } from "./product";

import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable()
export class EventSignupService extends AuthorizedHttpService {

  constructor(protected http: Http) {
    super(http);
  }
  
	public getProducts(groupId: number, eventId: number): Observable<Product[]> {
		let username = localStorage.getItem("user");
		let data = {
			"groupId": groupId,
			"eventId": eventId
		};

		return this.http.post("/api/user/" + username + "/event/products", data, { headers: this.headers })
			.map((res: Response) => {
				return res.json().map(d => Product.fromJSON(d));
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
}
