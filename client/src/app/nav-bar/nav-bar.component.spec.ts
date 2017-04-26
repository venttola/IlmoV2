import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarComponent } from './nav-bar.component';
import { AuthService } from "../authentication/auth.service";
import { Routing } from "../app.routing";
import { FrontPageComponent } from "../front-page/front-page.component";
import { LoginComponent } from "../login/login.component";
import { SignupComponent } from "../signup/signup.component";
import { MainPageComponent } from "../main-page/main-page.component";
import { AdminPageComponent } from "../admin-page/admin-page.component";
import { UserSettingsComponent } from "../user-settings/user-settings.component";
import { FormsModule } from "@angular/forms";
import { EventListingComponent } from "../event-listing/event-listing.component";
import { APP_BASE_HREF } from "@angular/common";

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, Routing],
      declarations: [
        NavBarComponent,
        FrontPageComponent,
        LoginComponent,
        SignupComponent,
        MainPageComponent,
        AdminPageComponent,
        UserSettingsComponent,
        EventListingComponent
      ],
      providers: [
        AuthService,
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
