import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from "./app.component";
import { Routing, RoutedComponents } from './app.routing';

import { LoginService } from "./front-page/login-component/login.service";
import { SignupService } from "./front-page/signup-component/signup.service";
import { AuthService } from "./authentication/auth.service";
import { AuthGuard } from "./authentication/auth-guard.service";
import { EventService} from "./event.service";
import { SignupComponentComponent } from './front-page/signup-component/signup.component';
import { LoginComponentComponent } from './front-page/login-component/login.component';


@NgModule({
  declarations: [
    AppComponent,
    RoutedComponents,
    SignupComponentComponent,
    LoginComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    Routing
  ],
  providers: [
    LoginService,
    SignupService,
    AuthService,
    AuthGuard,
    EventService
     ],
  bootstrap: [AppComponent]
})
export class AppModule { }
