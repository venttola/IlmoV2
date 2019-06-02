import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormsModule } from "@angular/forms";
import { LoginService } from "./login.service";
import { HttpModule } from "@angular/http";
import { AuthService } from "../authentication/auth.service";
import { Router, RouterModule } from "@angular/router";
import { Routing } from "../app.routing";
import { FrontPageComponent } from "../front-page/front-page.component";
import { SignupComponent } from "../signup/signup.component";
import { MainPageComponent } from "../main-page/main-page.component";
import { AdminPageComponent } from "../admin-page/admin-page.component";
import { UserSettingsComponent } from "../user-settings/user-settings.component";
import { EventListingComponent } from "../event-listing/event-listing.component";
import { APP_BASE_HREF } from "@angular/common";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule, Routing],
      declarations: [ 
        LoginComponent, 
        FrontPageComponent, 
        SignupComponent, 
        MainPageComponent, 
        AdminPageComponent,
        UserSettingsComponent,
        EventListingComponent],
      providers: [LoginService, AuthService,
      { provide: APP_BASE_HREF, useValue: '/' }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
