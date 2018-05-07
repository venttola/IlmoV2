import { NgModule } from "@angular/core";
import { RouterModule, Routes, CanActivate } from "@angular/router";

import { OrganizerComponent } from "./organizer.component";

import { OrganizerGuard } from "../authentication/organizer-guard.service";
import { OrganizationListingComponent } from './organization-listing/organization-listing.component';

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
