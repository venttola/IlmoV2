import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/forkJoin";

import { Platoon } from "../../shared/platoon.model";
import { Organization } from "../../shared/organization.model";
import { Event } from "../../shared/event.model";
import { Product } from "../../event-signup/product.model";

import { AuthorizedHttpService } from "../../authorizedhttp.service";

@Injectable()
export class EventCreatorService extends AuthorizedHttpService {
	eventsUrl: string;
	resultEvent: Event;
	error: any;
	constructor(protected http: Http) {
		super(http);
		this.eventsUrl = "/api/events/";
	}

	public createEvent(event: Event, platoons: Platoon[], organization: Organization, products: Product[]): Observable<any> {
		return this.http.post(this.eventsUrl, JSON.stringify(event), {headers: this.headers}).
		map(this.extractEventData).
		flatMap((resultEvent) => {

			let resultPlatoons = this.addPlatoons(resultEvent.id, platoons);
			let resultOrganization = this.setOrganization(resultEvent.id, organization);
			let resultProducts: Product[] = new Array<Product>();
			for (let product of products){
				this.addProduct(resultEvent.id, product).subscribe((resultProduct => resultProducts.push(resultProduct)),
				error => this.error = error );
			}
			return Observable.forkJoin(resultPlatoons, resultOrganization);
		}).
		catch(this.handleError);

	}
	public addPlatoons(eventId: number, platoons: Platoon[]): Observable <any>{
		console.log(this.eventsUrl + eventId + "/platoons");
		console.log(JSON.stringify(platoons));
		return this.http.post(this.eventsUrl + eventId + "/platoons", JSON.stringify({platoons: platoons}), {headers: this.headers}).
		map( this.extractPlatoonData).
		catch(this.handleError);

	}
	public setOrganization (eventId: number, organization: Organization): Observable<any>{
		return this.http.post(this.eventsUrl + eventId + "/organization", JSON.stringify(organization), {headers: this.headers}).
		map(this.extractOrganizationData).
		catch(this.handleError);
	}

	public addProduct(eventId: number, product: Product): Observable<Product>{
		return this.http.post(this.eventsUrl + eventId + "/product", JSON.stringify(product), {headers: this.headers}).
		map(this.extractProductData).
		catch(this.handleError);
	}

	protected extractEventData(res: Response): Event{
		let body = res.json();
		console.log("Extract eventData" + body);
		return Event.fromJSON(body.data.event);
	}
	protected extractPlatoonData(res: Response){
		let body = res.json();
		console.log("Extract platoonData" + JSON.stringify(body));

		let platoonList = new Array<Platoon>();
		res.json().map(platoon => platoonList.push(Platoon.fromJSON(platoon)));

		return platoonList;
	}
	protected extractOrganizationData(res: Response): Organization{
		let body = res.json();
		console.log("Extract organizationData: " + JSON.stringify(body.data.organization));
		return Organization.fromJSON(body.data.organization);
	}
	protected extractProductData(res: Response): Product{
		let body = res.json();
		console.log("Extract product data: " + JSON.stringify(body.data.product));
		return Product.fromJSON(body.data.product);
	}
}
