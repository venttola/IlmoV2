import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/forkJoin";

import { Organization } from "../../organization.model";
import { OrganizationMember } from "../organization-member.model";
import { Event } from "../../event.model";
import { AuthorizedHttpService } from "../../authorizedhttp.service";

@Injectable()
export class OrganizationService extends AuthorizedHttpService {
	organizationUrl: string;
	constructor(protected http: Http) {
		super(http);
		this.organizationUrl = this.urlBase + "organizations/";
	}
	public getOrganizations(): Observable<Organization[]> {
		return this.http.get(this.organizationUrl, {headers: this.headers}).
		map(this.extractOrganizationsData).
		catch(this.handleError);
	}

	public createOrganization (organization: Organization, members: OrganizationMember[]): Observable<any>{
		return this.addOrganization(organization).
			   flatMap((resultOrganization) => {
				   console.log("adding members");
			   	return this.addOrganizationMembers(resultOrganization.id, members);
		}).catch(this.handleError);

	}

	public addOrganization(organization: Organization): Observable<Organization> {
		return this.http.post(this.organizationUrl, JSON.stringify(organization), {headers: this.headers}).
		map(this.extractOrganizationData).
		catch(this.handleError);

	}
	public removeOrganization(organization: Organization) {
		return this.http.delete(this.organizationUrl + organization.id, {headers: this.headers}).
		map(this.extractOrganizationData).
		catch(this.handleError);

	}
	public addOrganizationMembers(organizationId: number, members: OrganizationMember[]) {
		return this.http.post(this.organizationUrl + organizationId.toString() + "/members", JSON.stringify(members), {headers: this.headers}).
		map(this.extractOrganizationData).
		catch(this.handleError);

	}
	public removeOrganizationMembers(organization: Organization, members: any[]) {


	}
	private extractOrganizationData(res: Response): Organization {
		let body = res.json();
		return Organization.fromJSON(body.data.organization);
	}
	private extractOrganizationsData(res: Response): Organization[] {
		let body = res.json();
		console.log("Extract eventData" + body);
		let organizationList = new Array <Organization>();
		for (let organization of body){
			organizationList.push(Organization.fromJSON(organization));
		}
		return organizationList;
	}

}
