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
import { EventService} from "./event.service";
import { LoginService } from "./login/login.service";
import { SignupService } from "./signup/signup.service";
import { UserSettingsService } from './user-settings/user-settings.service';
import { EventCreatorService } from "./admin-page/event-creator.service";
import { EventListingComponent } from './event-listing/event-listing.component';
import { EventDetailsService } from "./event-details/event-details.service";
import { EventCreatorComponentComponent } from './admin-page/event-creator-component/event-creator-component.component';
import { GroupModalComponent } from './event-details/group-modal/group-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    RoutedComponents,
    NavBarComponent,
    EventListingComponent, 
    EventCreatorComponentComponent,
    GroupModalComponent
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
    EventDetailsService
     ],
  bootstrap: [AppComponent]
})
export class AppModule { }
