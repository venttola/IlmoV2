import { NgModule } from "@angular/core";
import { RouterModule, Routes, CanActivate } from "@angular/router";

import { OrganizerComponent } from "./organizer.component";

import { OrganizationDetailsComponent } from '../organizer/organization-details/organization-details.component';
import { OrganizationListingComponent } from './organization-listing/organization-listing.component';

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
        component: OrganizationDetailsComponent
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
