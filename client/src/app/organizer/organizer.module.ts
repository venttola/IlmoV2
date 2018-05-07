import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizerRouterModule } from "./organizer-router.module";

import { OrganizerComponent } from './organizer.component';
import { OrganizationListingComponent } from './organization-listing/organization-listing.component';

@NgModule({
  imports: [
    CommonModule,
    OrganizerRouterModule
  ],
  declarations: [
    OrganizerComponent,
    OrganizationListingComponent,
  ]
})
export class OrganizerModule { }
