import { Component, Input, OnInit } from '@angular/core';

import { SignupData } from "./signupdata.model";
import { UserData } from "./user-data.model";
import { SignupService } from "./signup.service";

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @Input() signupData: SignupData;
  error: any;
  errorMessage: string;
  createdUser: UserData;
  constructor(private signupService: SignupService) { 
    this.errorMessage = "";
    this.createdUser = new UserData();
    console.log(!this.createdUser);
    console.log(!this.errorMessage);
  }
  
  ngOnInit() {
  	this.signupData = new SignupData();
  }

  attemptSignup(): void {
    this.errorMessage ="";
    this.createdUser = new UserData();
    console.log("Signing up");
    if (this.signupData.allPresent()){
      this.signupService.sendSignupRequest(this.signupData).
      subscribe(response => {
        this.createdUser.email = response.email;
        this.createdUser.id = response.id;  
        console.log(this.createdUser);
        console.log(!this.createdUser);
        console.log("Signed up");
      }, error => {
        this.errorMessage = error;
      });
    }
  }

}
