import { NgModule } from '@angular/core';

import { Routes, RouterModule, CanActivate } from '@angular/router';

const appRoutes: Routes = [
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full"
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}

//export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

