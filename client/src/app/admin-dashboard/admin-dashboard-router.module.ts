import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AdminDashboardComponent } from "./admin-dashboard.component";
import { EventManagementComponent } from "./event-management/event-management.component";
import { AdminGuard } from "../authentication/admin-guard.service";
const adminRoutes: Routes = [
  {
    path: "admin",
    component: AdminDashboardComponent,
    canActivate: [AdminGuard] 
  },
  {
    path: "admin/events/:eventId/manage",
    component: EventManagementComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full"
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  declarations: []
})
export class AdminDashboardRouterModule { }
