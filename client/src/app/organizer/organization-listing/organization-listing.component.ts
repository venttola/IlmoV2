import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { OrganizationListingService } from "./organization-listing.service";
import { Organization } from "../../shared/organization.model";
@Component({
  selector: 'organizer-organization-listing',
  templateUrl: './organization-listing.component.html',
  styleUrls: ['./organization-listing.component.css','../../styles/common-list.style.css']
})
export class OrganizationListingComponent implements OnInit {
  organizations: Observable<Organization[]>;
  constructor( private organizationListingService: OrganizationListingService) {
  }

  ngOnInit() {
    this.organizations = this.organizationListingService.getMemberships();
  }

}
