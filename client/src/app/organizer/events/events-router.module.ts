import { NgModule } from "@angular/core";
import { RouterModule, Routes, CanActivate } from "@angular/router";

import { EventsComponent } from "./events.component";


import { OrganizerGuard } from "../../authentication/organizer-guard.service";
const eventsRoutes: Routes = [
  // A kind of a crutch to make 
  {
    path: "organizer/:id/events/:eventId",
    component: EventsComponent,
    canActivate: [OrganizerGuard],
    canActivateChild: [OrganizerGuard]
  /*  children: [
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
    ]*/
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
