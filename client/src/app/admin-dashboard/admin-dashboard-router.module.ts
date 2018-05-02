import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';


import { AdminDashboardComponent } from "./admin-dashboard.component";
import { AdminDashboardHomeComponent } from "./admin-dashboard-home/admin-dashboard-home.component";
import { SimpleEventListingComponent } from "./simple-event-listing/simple-event-listing.component";
import { EventManagementComponent } from "./event-management/event-management.component";
import { EventCreatorComponent }  from "./event-creator/event-creator.component";
import { OrganizationHandlerComponent } from "./organization-handler/organization-handler.component";
import { PasswordResetComponent } from "./password-reset/password-reset.component";

import { AdminGuard } from "../authentication/admin-guard.service";

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: AdminDashboardHomeComponent,
        canActivate: [AdminGuard], 
        canActivateChild: [AdminGuard],
        children: [
          {
            path: 'events',
            component: SimpleEventListingComponent
          },
          {
            path: 'events/new',
            component: EventCreatorComponent
          },
          {
           path: 'events/:eventId',
           component: EventManagementComponent
          },
          {
            path: 'organization',
            component: OrganizationHandlerComponent
          },
          {
            path: 'resetuserpassword',
            component: PasswordResetComponent
          },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminDashboardRouterModule { }
