import { Component, Input, OnInit } from '@angular/core';

import { Product } from "../../events/shared/product.model";
@Component({
  selector: 'group-moderation-group-detail-row',
  templateUrl: './group-detail-row.component.html',
  styleUrls: ['./group-detail-row.component.css']
})
export class GroupDetailRowComponent implements OnInit {
  @Input() name: String;
  @Input() payments: Product[];
  constructor() {
  	this.name = "";
  	this.payments = [];
  	 }

  ngOnInit() {

  }

}
