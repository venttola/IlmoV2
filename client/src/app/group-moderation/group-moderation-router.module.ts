import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';


import { CheckoutComponent } from "./checkout/checkout.component";
import { GroupDetailsComponent } from "./group-details/group-details.component";
import { GroupListingComponent } from "./group-listing/group-listing.component";
import { GroupModerationComponent } from "./group-moderation.component"; 
import { GroupOverviewComponent } from "./group-overview/group-overview.component";
import { GroupSignupsComponent } from "./group-signups/group-signups.component";
import { ParticipantAddingComponent } from "./participant-adding/participant-adding.component";

import { AuthGuard } from "../authentication/auth-guard.service";

const groupsRoutes: Routes = [
   {
    path: "moderation",
    component: GroupModerationComponent,
    canActivate: [AuthGuard, ],
    children: [ 
      {
        path: "",
        component: GroupListingComponent
      },
      {
        path: "groups/:groupId",
        component: GroupDetailsComponent,
        // TODO: Fix GroupModerationGuard
        // If you add new group, you'll be a moderator in backend but the JWT token doesn't refresh
        // and so you won't be able to moderate the group until you log out and back in
        canActivate: [AuthGuard/*, GroupModeratorGuard*/],
        children: [
          {
           path: "",
           component: GroupOverviewComponent
          },
          {
            path: "checkout",
            component: CheckoutComponent
          },
          {
            path: "newparticipant",
            component: ParticipantAddingComponent
          },
          {
            path: "signups",
            component: GroupSignupsComponent
          }


        ]
      },
    ]
  },


  
];

@NgModule({
  imports: [
    RouterModule.forChild(groupsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class GroupModerationRouterModule { }
