import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//import { AdminService } from './shared/admin.service';
import { EventCreatorComponent } from './event-creator/event-creator.component';
import { EventCreatorService } from "./event-creator/event-creator.service";
import { EventManagementService } from "./event-management/event-management.service";
import { OrganizationHandlerComponent } from './organization-handler/organization-handler.component';
import { OrganizationService } from "./organization-handler/organization.service";
import { PasswordResetComponent } from './password-reset/password-reset.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
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
