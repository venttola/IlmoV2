import { Routes, RouterModule, CanActivate } from '@angular/router';

import { AuthGuard } from './authentication/auth-guard.service';

import { LoginPageComponent } from "./login-page/login-page.component";
import { MainPageComponent } from "./main-page/main-page.component";

const appRoutes: Routes = [
  {
    path: "",
    component: LoginPageComponent
  },
  {
  	path: "main",
  	component: MainPageComponent,
  	canActivate: [AuthGuard]
  }
];

export const Routing = RouterModule.forRoot(appRoutes);

export const RoutedComponents = [LoginPageComponent, 
								 MainPageComponent];
