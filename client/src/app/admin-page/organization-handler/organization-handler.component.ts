import { Component, OnInit, Input } from '@angular/core';
import { Organization } from "../../organization.model";
import { OrganizationService } from "./organization.service";
import { OrganizationMember } from "../organization-member.model";

@Component({
	selector: 'admin-organization-handler',
	templateUrl: './organization-handler.component.html',
	styleUrls: ['./organization-handler.component.css']
})
export class OrganizationHandlerComponent implements OnInit {
	@Input() newOrganization: Organization;
	@Input() organizationMembers: OrganizationMember[];
	error: any;
	constructor(private organizationService: OrganizationService) { 
		this.newOrganization = new Organization();
		this.organizationMembers = new Array<OrganizationMember>();
	}

	ngOnInit() {
	}
	public addOrganization(){
		this.organizationService.createOrganization(this.newOrganization, this.organizationMembers).
		subscribe(function(result){
			console.log("In AdminPageComponent" + result);
		}, error => this.error = <any>error);
	}
	addInputForMember(){
		this.organizationMembers.push(new OrganizationMember);

	}
	removeInputForMember(){
		this.organizationMembers.pop();

	}
	trackMember(index: number, member: OrganizationMember): string{
		return member.name;
	}
}
