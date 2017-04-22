import { Routes, RouterModule, CanActivate } from '@angular/router';

import { AuthGuard } from "./authentication/auth-guard.service";
import { AdminGuard } from "./authentication/admin-guard.service";


import { FrontPageComponent } from "./front-page/front-page.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { AdminPageComponent } from "./admin-page/admin-page.component";

const appRoutes: Routes = [
  {
    path: "",
    component: FrontPageComponent
  },
  {
  	path: "main",
  	component: MainPageComponent,
  	canActivate: [AuthGuard]
  },
  {
    path: "admin",
    component: AdminPageComponent,
    canActivate: [AdminGuard] 
  }
];

export const Routing = RouterModule.forRoot(appRoutes);

export const RoutedComponents = [FrontPageComponent, 
								                 MainPageComponent,  
                                 AdminPageComponent];
