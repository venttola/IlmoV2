import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';


import { GroupListingComponent } from "./group-listing/group-listing.component";
import { GroupDetailsComponent } from "./group-details/group-details.component";
import { CheckoutComponent } from "./checkout/checkout.component";

import { AuthGuard } from "../authentication/auth-guard.service";

const groupsRoutes: Routes = [
   {
    path: "moderation",
    component: GroupListingComponent,
    canActivate: [AuthGuard, ]
  },
  {
    path: "groups/:groupId",
    // TODO: Fix GroupModerationGuard
    // If you add new group, you'll be a moderator in backend but the JWT token doesn't refresh
    // and so you won't be able to moderate the group until you log out and back in
    canActivate: [AuthGuard/*, GroupModeratorGuard*/],
    children: [
      { path: '', component: GroupDetailsComponent },
      { path: 'checkout', component: CheckoutComponent }
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
