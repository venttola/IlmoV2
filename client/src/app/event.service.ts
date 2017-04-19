import { Injectable } from "@angular/core";
import { Http, Response, Headers} from "@angular/http";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import { Event } from "./event";
const URL_BASE = "http://localhost:8080/api/";
const EVENTS_URL = URL_BASE + "events";

@Injectable()
export class EventService {
  headers: Headers;
  constructor(private http: Http) {
      this.headers = new Headers( {"Content-Type": "application/json" });
  }

  getEventListing(): Observable<any[]>{
  	let response: any = this.http.get(EVENTS_URL).map(this.extractData).catch(this.handleError);
  	return (response);
  }
  private extractData(res: Response){
  	let body = res.json();
  	console.log(body);
  	return body || {};
  }
  private handleError(error: any): Promise<any> {
  	console.error("An error occurred", error);
  	return Promise.reject(error.message || error);
  }
}
