import { NgModule } from "@angular/core";
import { RouterModule, Routes, CanActivate } from "@angular/router";

import { EventsComponent } from "./events.component";

import { EventOverviewComponent } from "./event-overview/event-overview.component";
import { GroupListingComponent } from "./group-listing/group-listing.component";
import { OrganizerGuard } from "../../authentication/organizer-guard.service";
const eventsRoutes: Routes = [
  // A kind of a crutch to make 
  {
    path: "organizer/:id/events/:eventId",
    component: EventsComponent,
    canActivate: [OrganizerGuard],
    canActivateChild: [OrganizerGuard],
    children: [
      {
        path: "",
        component: EventOverviewComponent 
      },
      {
        path: "groups",
        component: GroupListingComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(eventsRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class EventsRouterModule { }
