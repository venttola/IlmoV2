import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { ProductRowComponent } from './product-row/product-row.component';
import { GroupModalComponent } from './group-modal/group-modal.component';


@NgModule({
  imports: [
  CommonModule,
  FormsModule
  ],
  declarations: [
  GroupModalComponent,
  ProductRowComponent
  ],
  providers: [

  ],
  exports: [
    GroupModalComponent,
    ProductRowComponent,
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }

