import { NgModule } from '@angular/core';

import { Routes, RouterModule, CanActivate } from '@angular/router';

import { AuthGuard } from "./authentication/auth-guard.service";
import { AdminGuard } from "./authentication/admin-guard.service";
import { GroupModeratorGuard } from "./authentication/group-moderator-guard.service";

import { FrontPageComponent } from "./front-page/front-page.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { UserSettingsComponent } from "./user-settings/user-settings.component";
import { EventDetailsComponent } from "./event-details/event-details.component";
import { EventSignupComponent } from "./event-signup/event-signup.component";
import { EventSignupListingComponent } from "./event-signup-listing/event-signup-listing.component";
import { GroupModerationComponent } from "./group-moderation/group-moderation.component";
import { GroupPageComponent } from "./group-moderation/group-page/group-page.component";
import { GroupCheckoutPageComponent } from "./group-moderation/group-page/group-checkout-page/group-checkout-page.component";

const appRoutes: Routes = [
  {
    path: "",
    component: FrontPageComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignupComponent
  },
  {
  	path: "events",
  	component: MainPageComponent
 
  },
  {
    path: "settings",
    component: UserSettingsComponent,
    canActivate: [AuthGuard]
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
  {
    path: "moderation",
    component: GroupModerationComponent,
    canActivate: [AuthGuard, ]
  },
  {
    path: "groups/:groupId",
    // TODO: Fix GroupModerationGuard
    // If you add new group, you'll be a moderator in backend but the JWT token doesn't refresh
    // and so you won't be able to moderate the group until you log out and back in
    canActivate: [AuthGuard/*, GroupModeratorGuard*/],
    children: [
      { path: '', component: GroupPageComponent },
      { path: 'checkout', component: GroupCheckoutPageComponent }
    ]
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full"
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}

//export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

export const RoutedComponents = [FrontPageComponent, 
                                 MainPageComponent,  
                                 LoginComponent,
                                 SignupComponent,
                                 UserSettingsComponent,
                                 EventDetailsComponent
                                 ];
