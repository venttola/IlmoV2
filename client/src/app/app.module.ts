import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from "./app.component";
import { Routing, RoutedComponents } from './app.routing';

import { LoginService } from "./loginpage/login.service";
import { SignupService } from "./loginpage/signup.service";
import { AuthService } from "./authentication/auth.service";
import { AuthGuard } from "./authentication/auth-guard.service";

@NgModule({
  declarations: [
    AppComponent,
    RoutedComponents
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
     ],
  bootstrap: [AppComponent]
})
export class AppModule { }