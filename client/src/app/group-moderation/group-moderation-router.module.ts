import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';


import { CheckoutComponent } from "./checkout/checkout.component";
import { GroupDetailsComponent } from "./group-details/group-details.component";
import { GroupListingComponent } from "./group-listing/group-listing.component";
import { GroupModerationComponent } from "./group-moderation.component"; 

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
      },
      { path: "groups/:groupId/checkout",
        component: CheckoutComponent 
      }
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
