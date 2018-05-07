import { NgModule } from "@angular/core";
import { RouterModule, Routes, CanActivate } from "@angular/router";

import { OrganizerComponent } from "./organizer.component";

import { EventListingComponent } from './event-listing/event-listing.component';
import { OrganizationDetailsComponent } from '../organizer/organization-details/organization-details.component';
import { OrganizationListingComponent } from './organization-listing/organization-listing.component';
import { OrganizationMembersComponent } from './organization-members/organization-members.component';
import { OrganizationOverviewComponent } from './organization-overview/organization-overview.component';

import { OrganizerGuard } from "../authentication/organizer-guard.service";
const organizerRoutes: Routes = [
  {
    path: "organizer",
    component: OrganizerComponent,
    canActivate: [OrganizerGuard],
    canActivateChild: [OrganizerGuard],
    children: [
      {
        path: "",
        component: OrganizationListingComponent 
      },
      {
        path: ":id",
        component: OrganizationDetailsComponent,
        children: [ 
          {
            path: "",
            component: OrganizationOverviewComponent 
          },
          {
            path: "members",
            component: OrganizationMembersComponent
          },
          {
            path: "events",
            component: EventListingComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(organizerRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class OrganizerRouterModule { }
