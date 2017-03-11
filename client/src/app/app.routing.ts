import { Routes, RouterModule, CanActivate } from '@angular/router';

import { AuthGuard } from './authentication/auth-guard.service';

import { LoginPageComponent } from "./loginpage/login-page.component";

const appRoutes: Routes = [
  {
    path: "",
    component: LoginPageComponent
  }
];

export const Routing = RouterModule.forRoot(appRoutes);

export const RoutedComponents = [LoginPageComponent];
