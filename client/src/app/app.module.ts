import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { BootstrapModalModule } from "ng2-bootstrap-modal";

import { AdminDashboardModule } from "./admin-dashboard";
/*
import { EventCreatorService } from "./admin-page/event-creator/event-creator.service";
import { EventCreatorComponent } from './admin-page/event-creator/event-creator.component';
import { OrganizationHandlerComponent } from './admin-page/organization-handler/organization-handler.component';
import { OrganizationService } from "./admin-page/organization-handler/organization.service";
import { EventManagementService } from "./admin-page/event-management/event-management.service";
import { PasswordResetComponent } from './admin-page/password-reset/password-reset.component';
import { AdminService } from './admin-page/shared/admin.service';
*/
import { AppComponent } from "./app.component";
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { Routing, RoutedComponents } from './app.routing';


import { AuthService } from "./authentication/auth.service";
import { AuthGuard } from "./authentication/auth-guard.service";
import { AdminGuard } from "./authentication/admin-guard.service";
import { GroupModeratorGuard } from "./authentication/group-moderator-guard.service";
import { EventService } from "./event.service";
import { LoginService } from "./login/login.service";
import { SignupService } from "./signup/signup.service";
import { UserSettingsService } from './user-settings/user-settings.service';
import { EventListingComponent } from './event-listing/event-listing.component';
import { EventDetailsService } from "./event-details/event-details.service";
import { GroupModalComponent } from './event-details/group-modal/group-modal.component';

import { EventSignupComponent } from './event-signup/event-signup.component';
import { ParticipantGroupService } from "./event-details/participant-group.service";
import { ProductRowComponent } from './event-signup/product-row/product-row.component';
import { EventSignupService } from "./event-signup/event-signup.service";
import { EventSignupListingComponent } from './event-signup-listing/event-signup-listing.component';
import { SignupListingService } from "./event-signup-listing/signup-listing.service";
import { GroupModerationComponent } from './group-moderation/group-moderation.component';
import { GroupModerationService } from "./group-moderation/group-moderation.service";
import { GroupPageComponent } from './group-moderation/group-page/group-page.component';

import { PrivacyPolicyModalComponent } from './privacy-policy-modal/privacy-policy-modal.component';
import { GroupCheckoutPageComponent } from './group-moderation/group-page/group-checkout-page/group-checkout-page.component';

@NgModule({
  declarations: [
    AppComponent,
    RoutedComponents,
    NavBarComponent,
    EventListingComponent, 
    GroupModalComponent,
    EventSignupComponent,
    ProductRowComponent,
    EventSignupListingComponent,
    GroupModerationComponent,
    GroupPageComponent,
    PrivacyPolicyModalComponent,
    GroupCheckoutPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgbModule.forRoot(),
    FormsModule,
    Routing,
    BootstrapModalModule,
    AdminDashboardModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    AdminGuard,
    GroupModeratorGuard,
    EventService,
    LoginService,
    SignupService,
    UserSettingsService,
    EventDetailsService,
    ParticipantGroupService,
    EventSignupService,
    SignupListingService,
    GroupModerationService,
    AdminService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
