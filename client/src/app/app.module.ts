import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { BootstrapModalModule } from "ng2-bootstrap-modal";

import { AdminDashboardModule } from "./admin-dashboard/admin-dashboard.module";
import { EventsModule } from "./events/events.module";
import { GroupModerationModule } from "./group-moderation/group-moderation.module";
import { SharedModule } from './shared/shared.module';

import { AppComponent } from "./app.component";
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AppRoutingModule, RoutedComponents } from './app-routing.module';


import { AuthService } from "./authentication/auth.service";
import { AuthGuard } from "./authentication/auth-guard.service";
import { AdminGuard } from "./authentication/admin-guard.service";
import { GroupModeratorGuard } from "./authentication/group-moderator-guard.service";
import { LoginService } from "./login/login.service";
import { SignupService } from "./signup/signup.service";
import { UserSettingsService } from './user-settings/user-settings.service';

import { PrivacyPolicyModalComponent } from './privacy-policy-modal/privacy-policy-modal.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    NgbModule.forRoot(),
    FormsModule,
    BootstrapModalModule,
    AdminDashboardModule,
    EventsModule,
    GroupModerationModule,
    SharedModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    RoutedComponents,
    NavBarComponent,
    PrivacyPolicyModalComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    AdminGuard,
    GroupModeratorGuard,
    LoginService,
    SignupService,
    UserSettingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
