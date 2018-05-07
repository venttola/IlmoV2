import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizerRouterModule } from "./organizer-router.module";

import { OrganizerComponent } from './organizer.component';
import { OrganizationListingComponent } from './organization-listing/organization-listing.component';
import { OrganizationDetailsComponent } from '../organizer/organization-details/organization-details.component';

@NgModule({
  imports: [
    CommonModule,
    OrganizerRouterModule
  ],
  declarations: [
    OrganizerComponent,
    OrganizationListingComponent,
    OrganizationDetailsComponent,
  ]
})
export class OrganizerModule { }
