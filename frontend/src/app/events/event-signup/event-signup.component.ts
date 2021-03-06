import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { EventDetailsService } from "../event-details/event-details.service";
import { EventSignupService } from "./event-signup.service";
import { ParticipantGroupService } from "../event-details/participant-group.service";
import { ParticipantGroup } from "../shared/participantgroup.model";
import { Product } from "../shared/product.model";
import { Discount } from "../shared/discount.model";
import { SignupData } from "./signup-data.model"; 

@Component({
  selector: 'app-event-signup',
  templateUrl: './event-signup.component.html',
  styleUrls: ['./event-signup.component.css']
})
export class EventSignupComponent implements OnInit {

  participantGroup: ParticipantGroup;

  products: Product[] = [];
  selectedProducts: Product[] = [];

  signedUp: boolean = false;
  signupSuccessful: boolean;
  updateSuccessful: boolean;
  isRegistrationOpen: boolean;

  constructor(private route: ActivatedRoute,
    private eventSignupService: EventSignupService,
    private participantGroupService: ParticipantGroupService,
    private router: Router) { }

  ngOnInit() {
    this.signupSuccessful = false;
    this.route.params
      .switchMap((params: Params) => this.eventSignupService.getSignupData(+params["groupId"], +params["eventId"]))
      .subscribe((data: SignupData) => {
        this.signedUp = data.signedUp;
        this.isRegistrationOpen = data.isRegistrationOpen;
        this.participantGroup = data.group;
        this.products = data.eventProducts;
        this.selectedProducts = this.products
                                .filter((p: Product) => p.selected === true);
      });
  }

  addSignup() {
    let prods = this.products
      .filter((p: Product) => p.selected === true);

    let prodIds = this.selectedProducts.map((p: Product) => {
      let discounts = p.discounts.filter((d: Discount) => d.selected === true);
      let discountId: number = discounts && discounts.length > 0 ? discounts[0].id : null;

      return [p.id, discountId];
    });

    this.eventSignupService.saveSignup(this.participantGroup.id, prodIds).subscribe((res: any) => {
      console.log("SignupSuccesfull");
      this.signupSuccessful = true;
    }, err => {

    });
  }
  updateSignup() {
    let prods = this.products
      .filter((p: Product) => p.selected === true);

    let prodIds = this.selectedProducts.map((p: Product) => {
      let discounts = p.discounts.filter((d: Discount) => d.selected === true);
      let discountId: number = discounts && discounts.length > 0 ? discounts[0].id : null;

      return [p.id, discountId];
    });

    this.eventSignupService.saveSignup(this.participantGroup.id, prodIds).subscribe((res: any) => {
      console.log("SignupSuccesfull");
      this.updateSuccessful = true;
    }, err => {

    });
  }

  cancelSignUp() {
    this.eventSignupService.cancelSignup(this.participantGroup.id)
      .subscribe((success: boolean) => this.router.navigate(["signups"]));
  }
  selectProduct(productId: number) {
    console.log("selected");
    console.log(productId);
    let prods = this.products
      .filter((p: Product) => p.id == productId);
    prods.map((p: Product) => p.selected = true);
    console.log(prods);
    this.selectedProducts = this.selectedProducts.concat(prods);
    console.log(this.selectedProducts);
  }
  deselectProduct(productId: number) {
     console.log("remooved");
    console.log(productId);
    this.selectedProducts = this.selectedProducts.filter((p: Product) => p.id != productId);
  }
}
