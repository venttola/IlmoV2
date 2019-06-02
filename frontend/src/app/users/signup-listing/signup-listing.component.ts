import { Component, OnInit } from '@angular/core';
import { SignupDetails } from "./signup-details";
import { SignupListingService } from "./signup-listing.service";

@Component({
  selector: 'user-signup-listing',
  templateUrl: './signup-listing.component.html',
  styleUrls: ['./signup-listing.component.css']
})
export class SignupListingComponent implements OnInit {

  signupDetails: SignupDetails[] = [];

  constructor(private signupListingService: SignupListingService) { }

  ngOnInit() {
    this.signupListingService.getSignupDetails()
      .subscribe(s => this.signupDetails = s,
      error => console.log(error));
  }

}
