import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//import { AdminService } from './shared/admin.service';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { EventCreatorComponent } from './event-creator/event-creator.component';
import { EventCreatorService } from "./event-creator/event-creator.service";
import { EventManagementComponent } from "./event-management/event-management.component"
import { EventManagementService } from "./event-management/event-management.service";
import { OrganizationHandlerComponent } from './organization-handler/organization-handler.component';
import { OrganizationService } from "./organization-handler/organization.service";
import { PasswordResetComponent } from './password-reset/password-reset.component';

import { AdminDashboardRouterModule } from './admin-dashboard-router.module';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    AdminDashboardRouterModule,
    SharedModule
  ],
  declarations: [
    AdminDashboardComponent,
    EventManagementComponent,
    EventCreatorComponent,
    OrganizationHandlerComponent,
    PasswordResetComponent
  ],
  providers: [
    EventCreatorService,
    EventManagementService,
    OrganizationService
  ]
})
export class AdminDashboardModule { }