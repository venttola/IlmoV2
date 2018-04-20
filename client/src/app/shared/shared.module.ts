import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { GroupModalComponent } from './group-modal/group-modal.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PrivacyPolicyModalComponent } from './privacy-policy-modal/privacy-policy-modal.component';
import { ProductRowComponent } from './product-row/product-row.component';


@NgModule({
  imports: [
  CommonModule,
  FormsModule,
  NgbModule,
  RouterModule
  ],
  declarations: [
  GroupModalComponent,
  NavBarComponent,
  PrivacyPolicyModalComponent,
  ProductRowComponent
  ],
  providers: [

  ],
  exports: [
    GroupModalComponent,
    ProductRowComponent,
    NavBarComponent,
    PrivacyPolicyModalComponent,
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }

