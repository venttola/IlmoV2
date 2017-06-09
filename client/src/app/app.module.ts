import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { BootstrapModalModule } from "ng2-bootstrap-modal";

import { AppComponent } from "./app.component";
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { Routing, RoutedComponents } from './app.routing';

import { AuthService } from "./authentication/auth.service";
import { AuthGuard } from "./authentication/auth-guard.service";
import { AdminGuard } from "./authentication/admin-guard.service";
import { EventService } from "./event.service";
import { LoginService } from "./login/login.service";
import { SignupService } from "./signup/signup.service";
import { UserSettingsService } from './user-settings/user-settings.service';
import { EventCreatorService } from "./admin-page/event-creator/event-creator.service";
import { EventListingComponent } from './event-listing/event-listing.component';
import { EventDetailsService } from "./event-details/event-details.service";
import { EventCreatorComponent } from './admin-page/event-creator/event-creator.component';
import { GroupModalComponent } from './event-details/group-modal/group-modal.component';
import { OrganizationHandlerComponent } from './admin-page/organization-handler/organization-handler.component';
import { OrganizationService } from "./admin-page/organization-handler/organization.service";
import { EventManagementService } from "./admin-page/event-management/event-management.service";

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
    EventCreatorComponent,
    GroupModalComponent,
    EventSignupComponent,
    ProductRowComponent,
    OrganizationHandlerComponent,
    EventSignupListingComponent,
    GroupModerationComponent,
    GroupPageComponent,
    PrivacyPolicyModalComponent,
    GroupCheckoutPageComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgbModule.forRoot(),
    FormsModule,
    Routing,
    BootstrapModalModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    AdminGuard,
    EventService,
    LoginService,
    SignupService,
    UserSettingsService,
    EventCreatorService,
    EventDetailsService,
    OrganizationService,
    ParticipantGroupService,
    EventSignupService,
    EventManagementService,
    SignupListingService,
    GroupModerationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
