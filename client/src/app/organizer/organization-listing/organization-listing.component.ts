import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'organizer-organization-listing',
  templateUrl: './organization-listing.component.html',
  styleUrls: ['./organization-listing.component.css']
})
export class OrganizationListingComponent implements OnInit {
  organizations: any[];
  constructor() {
    this.organizations = [];
  }

  ngOnInit() {
  }

}
