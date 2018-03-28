import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';


import { EventDetailsComponent } from "./event-details/event-details.component";
import { EventListingComponent } from "./event-listing/event-listing.component"

import { EventSignupComponent } from "./event-signup/event-signup.component";
import { EventSignupListingComponent } from "./event-signup-listing/event-signup-listing.component";

import { AuthGuard } from "../authentication/auth-guard.service";

const adminRoutes: Routes = [
  {
    path: "events",
    component: EventListingComponent
  },
  {
    path: "events/:id",
    component: EventDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "events/:eventId/group/:groupId",
    component: EventSignupComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "signups",
    component: EventSignupListingComponent,
    canActivate: [AuthGuard],
  },
  
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class EventsRouterModule { }
