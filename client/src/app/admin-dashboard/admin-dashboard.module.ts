import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDashboardRouterModule } from './admin-dashboard-router.module';
import { SharedModule } from '../shared/shared.module';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminDashboardHomeComponent } from './admin-dashboard-home/admin-dashboard-home.component';
import { EventCreatorComponent } from './event-creator/event-creator.component';
import { EventManagementComponent } from "./event-management/event-management.component"
import { OrganizationHandlerComponent } from './organization-handler/organization-handler.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

import { AdminService } from './shared/admin.service';
import { EventCreatorService } from "./event-creator/event-creator.service";
import { EventManagementService } from "./event-management/event-management.service";
import { OrganizationService } from "./organization-handler/organization.service";



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminDashboardRouterModule
  ],
  declarations: [
    AdminDashboardComponent,
    AdminDashboardHomeComponent,
    EventManagementComponent,
    EventCreatorComponent,
    OrganizationHandlerComponent,
    PasswordResetComponent
  ],
  providers: [
    AdminService,
    EventCreatorService,
    EventManagementService,
    OrganizationService
  ]
})
export class AdminDashboardModule { }
