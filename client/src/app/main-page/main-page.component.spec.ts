import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageComponent } from './main-page.component';
import { EventListingComponent } from "../event-listing/event-listing.component";
import { Routing } from "../app.routing";
import { FrontPageComponent } from "../front-page/front-page.component";
import { LoginComponent } from "../login/login.component";
import { SignupComponent } from "../signup/signup.component";
import { AdminPageComponent } from "../admin-page/admin-page.component";
import { UserSettingsComponent } from "../user-settings/user-settings.component";
import { FormsModule } from "@angular/forms";
import { APP_BASE_HREF } from "@angular/common";
import { AuthService } from "../authentication/auth.service";
import { EventService } from "../shared/event.service";
import { HttpModule } from "@angular/http";

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, FormsModule, Routing],
      declarations: [
        MainPageComponent,
        EventListingComponent,
        FrontPageComponent,
        LoginComponent,
        SignupComponent,
        AdminPageComponent,
        UserSettingsComponent
      ],
      providers: [
        AuthService,
        EventService,
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
