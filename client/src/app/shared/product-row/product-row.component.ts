import { Component, OnInit, Input } from '@angular/core';

import { Product } from "../../events/shared/product.model";
import { Discount } from "../../events/shared/discount.model";

@Component({
  selector: 'product-row',
  templateUrl: './product-row.component.html',
  styleUrls: ['./product-row.component.css']
})
export class ProductRowComponent implements OnInit {

  @Input() product: Product;

  selectedDiscount: Discount;

  constructor() { }

  ngOnInit() {
    console.log("Selected disc:" + this.product.discounts.find(d => d.selected === true));
    let selected = this.product.discounts.find(d => d.selected === true);
    this.selectedDiscount = selected ? selected : null;
  }

  onChange(newValue: Discount) {

    console.log("New: " + newValue);

    this.selectedDiscount = newValue;

    let oldSelected = this.product.discounts.find(d => d.selected === true);
    if (oldSelected) oldSelected.selected = false;

    if (newValue != null) {
      this.product.discounts.find(d => d.id === this.selectedDiscount.id).selected = true;
    }
  }
}
