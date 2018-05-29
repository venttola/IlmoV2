import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizerRouterModule } from "./organizer-router.module";

import { OrganizerComponent } from './organizer.component';
import { OrganizationListingComponent } from './organization-listing/organization-listing.component';
import { OrganizationDetailsComponent } from '../organizer/organization-details/organization-details.component';
import { EventListingComponent } from './event-listing/event-listing.component';
import { OrganizationMembersComponent } from './organization-members/organization-members.component';
import { OrganizationOverviewComponent } from './organization-overview/organization-overview.component';

import { EventListingService } from './event-listing/event-listing.service';
import { OrganizationListingService } from "./organization-listing/organization-listing.service";

@NgModule({
  imports: [
    CommonModule,
    OrganizerRouterModule
  ],
  declarations: [
    OrganizerComponent,
    OrganizationListingComponent,
    OrganizationDetailsComponent,
    EventListingComponent,
    OrganizationOverviewComponent,
    OrganizationMembersComponent,
  ],
  providers: [
    EventListingService,
    OrganizationListingService
  ]
})
export class OrganizerModule { }
