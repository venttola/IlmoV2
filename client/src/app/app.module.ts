import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { HttpModule } from "@angular/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from "./app.component";
import { Routing, RoutedComponents } from './app.routing';

import { AuthService } from "./authentication/auth.service";
import { AuthGuard } from "./authentication/auth-guard.service";
import { EventService} from "./event.service";

import { FrontPageModule } from "./front-page/front-page.module";

@NgModule({
  declarations: [
    AppComponent,
    RoutedComponents
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgbModule.forRoot(),
    Routing,
    FrontPageModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    EventService
     ],
  bootstrap: [AppComponent]
})
export class AppModule { }
